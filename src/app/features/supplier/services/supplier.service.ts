import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PaginationResponseInterface } from '../../../shared/interfaces/common.interface';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '@/app/shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  toastService = inject(ToastService);
  destroyRef = inject(DestroyRef);
  suppliers = signal<PaginationResponseInterface<SupplierInterface> | undefined>(undefined);
  is_loading = signal(false);
  selected_supplier = signal<SupplierInterface | null>(null);

  async get(params?: Record<string, string>) {
    this.is_loading.set(true);
    await firstValueFrom(
      this.http.get<PaginationResponseInterface<SupplierInterface>>('/api/supplier', { params }),
    )
      .then((data) => {
        console.log(data);
        this.suppliers.set(data);
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async delete(id: number) {
    this.is_loading.set(true);

    await firstValueFrom(this.http.delete(`/api/supplier/${id}`))
      .then(() => {
        this.suppliers.update((suppliers) => {
          if (!suppliers) return suppliers;
          return {
            ...suppliers,
            data: suppliers.data.filter((supplier) => supplier.id !== id),
          };
        });
        this.toastService.show({
          message: 'Proveedor eliminado',
          type: 'success',
        });
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async disable(id: number) {
    this.is_loading.set(true);

    await firstValueFrom(this.http.patch(`/api/supplier/${id}/disable`, {}))
      .then(() => {
        this.suppliers.update((suppliers) => {
          if (!suppliers) return suppliers;
          return {
            ...suppliers,
            data: suppliers.data.map((supplier) => {
              if (supplier.id === id) {
                return {
                  ...supplier,
                  disabled_at: supplier.disabled_at ? null : new Date(),
                };
              }
              return supplier;
            }),
          };
        });
        this.toastService.show({
          message:
            'Proveedor ' + (this.selected_supplier()?.disabled_at ? 'habilitado' : 'deshabilitado'),
          type: 'success',
        });
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async listen_to_query_params() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (params) => {
      await this.get(params);
    });
  }
}
