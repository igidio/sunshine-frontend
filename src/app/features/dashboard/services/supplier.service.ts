import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  http = inject(HttpClient);
  suppliers = signal<SupplierInterface[]>([]);
  is_loading = signal(false);

  get() {
    firstValueFrom(this.http.get<SupplierInterface[]>('/api/supplier')).then((data) => {
      this.suppliers.set(data);
    });
  }
}
