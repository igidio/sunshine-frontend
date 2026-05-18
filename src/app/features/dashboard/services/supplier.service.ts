import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PaginationResponseInterface } from '../../../shared/interfaces/common.interface';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  http = inject(HttpClient);
  suppliers = signal<PaginationResponseInterface<SupplierInterface> | undefined>(undefined);
  is_loading = signal(false);

  get() {
    firstValueFrom(
      this.http.get<PaginationResponseInterface<SupplierInterface>>('/api/supplier'),
    ).then((data) => {
      this.suppliers.set(data);
    });
  }
}
