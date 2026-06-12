import { Injectable, signal, inject, DestroyRef, computed } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@/app/core/services/auth.service';
import { PaymentMethod, SaleInterface } from "../interfaces/sale.interface";
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from "@/app/shared/services/toast.service";

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  toastService = inject(ToastService);

  sales = signal<PaginationResponseInterface<SaleInterface> | undefined>(undefined);
  is_loading = signal(false);

  can_manage_sales = this.authService.has_permission('SALE');

  async get(params?: Record<string, string>) {
    this.is_loading.set(true);
    await firstValueFrom(
      this.http.get<PaginationResponseInterface<SaleInterface>>('/api/sale', { params }),
    )
      .then((data) => {
        this.sales.set(data);
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async get_one(id: number) {
    this.is_loading.set(true);
    const result = await firstValueFrom(
      this.http.get<SaleInterface>(`/api/sale/${id}`),
    ).finally(() => this.is_loading.set(false));
    return result;
  }

  async create(data: {
    customer_id: number;
    product_ids: number[];
    appointment_ids: number[];
    payment_method: PaymentMethod;
  }) {
    this.is_loading.set(true);
    const result = await firstValueFrom(
      this.http.post<SaleInterface>('/api/sale', data),
    ).finally(() => this.is_loading.set(false));
    return result;
  }

  async open_bill(sale: SaleInterface) {
    const access_token = localStorage.getItem('access_token');
    const response = await fetch(`/api/sale/${sale.id}/bill`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
      }
    });

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  }

  async generate_bill(sale: SaleInterface) {
    this.is_loading.set(true);
    try {
      const result = await firstValueFrom(
        this.http.post<{ bill: string }>(`/api/sale/${sale.id}/bill`, {}),
      );

      this.sales.update((current) => {
        if (!current) return current;
        return {
          ...current,
          data: current.data.map((item) =>
            item.id === sale.id ? { ...item, bill: result.bill } : item
          ),
        };
      });
      this.toastService.show({
        message: 'Factura generada correctamente',
        type: 'success',
      });


      return result;
    } finally {
      this.is_loading.set(false);
    }
  }

  async listen_to_query_params(component_destroy_ref: DestroyRef) {
    this.route.queryParams
      .pipe(takeUntilDestroyed(component_destroy_ref))
      .subscribe(async (params) => {
        await this.get(params);
      });
  }
}
