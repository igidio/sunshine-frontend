import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from 'rxjs';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { CustomerInterface } from '../../customer/interfaces/customer.interface';
import { ProductInterface } from '../../product/interfaces/product.interface';
import { AppointmentInterface } from '../../appointment/interfaces/appointment.interface';
import { SelectMenuOption } from '@/app/shared/ui/ui-select-menu/ui-select-menu';
import { PaymentMethod } from '../interfaces/sale.interface';

@Injectable({
  providedIn: 'root',
})
export class SaleCreateService {
  http = inject(HttpClient);

  customer = signal<CustomerInterface | undefined>(undefined);
  products = signal<ProductInterface[]>([]);
  appointments = signal<AppointmentInterface[]>([]);
  discount = signal<number>(0);
  payment_method = signal<PaymentMethod>('cash');

  customer_value = signal<CustomerInterface | null>(null);
  product_value = signal<ProductInterface | null>(null);
  appointment_value = signal<AppointmentInterface | null>(null);

  fetch_customers = async (search: string = ''): Promise<SelectMenuOption[]> => {
    const response = await firstValueFrom(
      this.http.get<PaginationResponseInterface<CustomerInterface>>('/api/customer', {
        params: { search, limit: '20' },
      }),
    );
    return response.data.map<SelectMenuOption>((customer) => ({
      name: `${customer.profile.first_name} ${customer.profile.last_name}`,
      label: `${customer.profile.first_name} ${customer.profile.last_name}`,
      value: customer,
    }));
  }

  fetch_products = async (search: string = ''): Promise<SelectMenuOption[]> => {
    const response = await firstValueFrom(
      this.http.get<PaginationResponseInterface<ProductInterface>>('/api/product', {
        params: { search, limit: '20' },
      }),
    );
    const selectedIds = new Set(this.products().map((p) => p.id));
    return response.data
      .filter((product) => !selectedIds.has(product.id))
      .map<SelectMenuOption>((product) => ({
        name: product.name,
        label: `${product.name} - ${product.price} Bs.`,
        value: product,
      }));
  }

  fetch_appointments = async (search: string = ''): Promise<SelectMenuOption[]> => {
    if (!this.customer()) {
      return [];
    }
    const response = await firstValueFrom(
      this.http.get<PaginationResponseInterface<AppointmentInterface>>('/api/appointment', {
        params: { search, limit: '20', customer_id: this.customer()?.id! },
      }),
    );
    const selected_appointments = new Set(this.appointments().map((a) => a.id));
    return response.data
      .filter((appointment) => !selected_appointments.has(appointment.id))
      .map<SelectMenuOption>((appointment) => ({
        name: appointment.treatment!.name,
        label: `${appointment.treatment!.name} - ${appointment.treatment!.price} Bs.`,
        value: appointment,
      }));
  }

  on_customer_change(customer: CustomerInterface | null) {
    this.customer.set(customer ?? undefined);
  }

  clear_customer() {
    this.customer.set(undefined);
    this.customer_value.set(null);
    this.products.set([]);
    this.appointments.set([]);
  }

  add_product(product: ProductInterface | null) {
    if (product) {
      this.products.update((products) => [...products, product]);
      this.product_value.set(null);
    }
  }

  add_appointment(appointment: AppointmentInterface | null) {
    if (appointment?.treatment) {
      this.appointments.update((appointments) => [...appointments, appointment]);
      this.appointment_value.set(null);
    }
  }

  remove_product(product: ProductInterface) {
    this.products.update((products) =>
      products.filter((p) => p.id !== product.id),
    );
  }

  remove_appointment(appointment: AppointmentInterface) {
    this.appointments.update((appointments) =>
      appointments.filter((a) => a.id !== appointment.id),
    );
  }

  total_products = computed(() =>
    this.products().reduce((sum, p) => sum + Number(p.price), 0),
  );

  total_appointments = computed(() =>
    this.appointments().reduce(
      (sum, a) => sum + (a.treatment ? Number(a.treatment.price) : 0),
      0,
    ),
  );

  total = computed(() => {
    return this.total_products() + this.total_appointments();
  });
}
