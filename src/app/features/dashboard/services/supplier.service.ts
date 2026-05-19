import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PaginationResponseInterface } from '../../../shared/interfaces/common.interface';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  suppliers = signal<PaginationResponseInterface<SupplierInterface> | undefined>(undefined);
  is_loading = signal(false);

  get(params?: Record<string, string>) {
    firstValueFrom(
      this.http.get<PaginationResponseInterface<SupplierInterface>>('/api/supplier', { params }),
    ).then((data) => {
      console.log(data);

      this.suppliers.set(data);
    });
  }

  listen_to_query_params() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      console.log(params);

      this.get(params);
    });
  }
}
