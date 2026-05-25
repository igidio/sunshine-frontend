import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { firstValueFrom } from 'rxjs';
import { MovementInterface } from '../interfaces/movement.interface';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  http = inject(HttpClient);
  is_loading = signal(false);
  stocks = signal<PaginationResponseInterface<MovementInterface> | undefined>(undefined);

  async get(params?: Record<string, string>) {
    this.is_loading.set(true);
    await firstValueFrom(
      this.http.get<PaginationResponseInterface<MovementInterface>>('/api/movement', { params }),
    )
      .then((data) => {
        this.stocks.set(data);
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }
  async listen_to_query_params() {
    await this.get();

    //this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (params) => {
    //await this.get(params);
    //});
  }
}
