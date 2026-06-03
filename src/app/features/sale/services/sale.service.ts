import { Injectable, signal, inject, DestroyRef } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SaleInterface } from "../interfaces/sale.interface";
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);

  sales = signal<PaginationResponseInterface<SaleInterface> | undefined>(undefined);
  is_loading = signal(false);
  selected_sale = signal<SaleInterface | null>(null);

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

  async listen_to_query_params(component_destroy_ref: DestroyRef) {
    this.route.queryParams
      .pipe(takeUntilDestroyed(component_destroy_ref))
      .subscribe(async (params) => {
        await this.get(params);
      });
  }
}
