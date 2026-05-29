import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';

import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { firstValueFrom } from 'rxjs';
import { MovementInterface, MovementType } from '../interfaces/movement.interface';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '@/app/shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  http = inject(HttpClient);
  toastService = inject(ToastService);
  is_loading = signal(false);
  route = inject(ActivatedRoute);

  movements = signal<PaginationResponseInterface<MovementInterface> | undefined>(undefined);
  offset = signal(0);
  limit = signal(10);

  async get(params?: Record<string, string | number>) {
    this.is_loading.set(true);
    const result = await firstValueFrom(
      this.http.get<PaginationResponseInterface<MovementInterface>>('/api/movement', { params }),
    ).finally(() => {
      this.is_loading.set(false);
    });
    return result;
  }

  async load_more() {
    if (this.movements()?.is_last_page) return;

    await this.get({
      offset: this.offset() + this.limit(),
      limit: this.limit(),
    }).then((result) => {
      this.offset.update((offset) => {
        return offset + this.limit();
      });
      this.movements.update((movements) => {
        if (!movements) return movements;
        return {
          ...result,
          data: [...movements.data, ...(result.data || [])],
        };
      });
    });
  }

  async create(payload: {
    stock_id: number;
    supplier_id?: number;
    type: MovementType;
    quantity: number;
    notes?: string;
  }) {
    if (payload.type === 'purchase' && payload.supplier_id == null) {
      throw new Error('supplier_id es obligatorio cuando el tipo es purchase');
    }

    if (payload.type !== 'purchase' && !payload.notes?.trim()) {
      throw new Error('notes es obligatorio cuando el tipo no es purchase');
    }

    this.is_loading.set(true);
    const body = {
      stock_id: payload.stock_id,
      supplier_id: payload.supplier_id,
      type: payload.type,
      quantity: payload.quantity,
      notes: payload.notes,
    };

    const result = await firstValueFrom(this.http.post<MovementInterface>('/api/movement', body))
      .then(async (response) => {
        this.toastService.show({
          message: 'Movimiento registrado exitosamente',
          type: 'success',
        });
        const new_results = await this.get();
        this.movements.set(new_results);
        return response;
      })
      .finally(() => {
        this.is_loading.set(false);
      });
    return result;
  }

  async listen_to_query_params(component_destroy_ref: DestroyRef) {
    this.route.queryParams
      .pipe(takeUntilDestroyed(component_destroy_ref))
      .subscribe(async (params) => {
        await this.get(params).then((data) => {
          this.movements.set(data);
        });
      });
  }

  reset() {
    this.offset.set(0);
    this.limit.set(10);
  }
}
