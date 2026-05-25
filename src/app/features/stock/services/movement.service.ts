import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';

import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { firstValueFrom } from 'rxjs';
import { MovementInterface } from '../interfaces/movement.interface';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  http = inject(HttpClient);
  is_loading = signal(false);
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

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

  async listen_to_query_params() {
    await this.get().then((data) => {
      this.movements.set(data);
    });

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (params) => {
      await this.get(params).then((data) => {
        this.movements.set(data);
      });
    });
  }
}
