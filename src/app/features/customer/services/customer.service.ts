import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { ToastService } from '@/app/shared/services/toast.service';
import { AuthService } from '@/app/core/services/auth.service';
import { CustomerInterface } from '../interfaces/customer.interface';

export interface CustomerPayload {
  first_name: string;
  last_name: string;
  birth_date: string;
  address: string;
  phone_number: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  customers = signal<PaginationResponseInterface<CustomerInterface> | undefined>(undefined);
  is_loading = signal(false);
  selected_customer = signal<CustomerInterface | null>(null);

  can_manage_customers = this.authService.has_permission('CUSTOMER');

  async get(params?: Record<string, string>) {
    this.is_loading.set(true);
    await firstValueFrom(
      this.http.get<PaginationResponseInterface<CustomerInterface>>('/api/customer', { params }),
    )
      .then((data) => {
        this.customers.set(data);
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async delete(id: number) {
    this.is_loading.set(true);

    await firstValueFrom(this.http.delete(`/api/customer/${id}`))
      .then(() => {
        this.customers.update((customers) => {
          if (!customers) return customers;
          return {
            ...customers,
            data: customers.data.filter((customer) => customer.id !== id),
          };
        });
        this.toastService.show({
          message: 'Cliente eliminado',
          type: 'success',
        });
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async disable(id: number) {
    this.is_loading.set(true);

    await firstValueFrom(this.http.patch(`/api/customer/${id}/disable`, {}))
      .then(() => {
        this.customers.update((customers) => {
          if (!customers) return customers;
          return {
            ...customers,
            data: customers.data.map((customer) =>
              customer.id === id
                ? {
                  ...customer,
                  disabled_at: customer.disabled_at ? undefined : new Date(),
                }
                : customer,
            ),
          };
        });
        this.toastService.show({
          message:
            'Cliente ' + (this.selected_customer()?.disabled_at ? 'habilitado' : 'deshabilitado'),
          type: 'success',
        });
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async create_or_update(customer: CustomerPayload) {
    let endpoint = '/api/customer';
    let type: 'create' | 'update' = 'create';

    if (this.selected_customer()) {
      endpoint += `/${this.selected_customer()!.id}`;
      type = 'update';
    }

    const request = this.selected_customer()
      ? this.http.patch<CustomerInterface>(endpoint, customer)
      : this.http.post<CustomerInterface>(endpoint, customer);

    await firstValueFrom(request)
      .then((response) => {
        this.customers.update((customers) => {
          if (!customers) return customers;

          return {
            ...customers,
            data:
              type === 'create'
                ? [response, ...customers.data]
                : customers.data.map((item) => (item.id === response.id ? response : item)),
          };
        });

        this.toastService.show({
          message: `Cliente ${type === 'update' ? 'actualizado' : 'creado'} exitosamente`,
          type: 'success',
        });
      })
      .finally(() => {
        this.selected_customer.set(null);
      });
  }

  async listen_to_query_params(component_destroy_ref: DestroyRef) {
    this.route.queryParams
      .pipe(takeUntilDestroyed(component_destroy_ref))
      .subscribe(async (params) => {
        await this.get(params);
      });
  }
}
