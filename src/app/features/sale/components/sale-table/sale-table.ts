import { ChangeDetectionStrategy, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FilterBy, UiTable } from '@/app/shared/ui/ui-table/ui-table';
import { create_table_field, create_text_field } from '@/app/shared/ui/ui-table/ui-table_helper';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { SaleService } from '../../services/sale.service';
import { SaleInterface } from '../../interfaces/sale.interface';
import { SaleDetailDrawer } from '../sale-detail-drawer/sale-detail-drawer';
import { SalePaymentMethodBadge } from '../sale-payment-method-badge/sale-payment-method-badge';
import { payment_methods_labeled } from '../../data/sale.data';
import { Router } from '@angular/router';
import { SaleFilter } from '../sale-filter/sale-filter';

@Component({
  selector: 'sale-table',
  imports: [UiTable, UiButton, SaleDetailDrawer, SaleFilter],
  templateUrl: './sale-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class SaleTable {
  saleService = inject(SaleService);
  datePipe = inject(DatePipe);
  router = inject(Router);

  sale_detail_drawer_ref = viewChild<SaleDetailDrawer>('sale_detail_drawer');

  fields = [
    create_text_field<SaleInterface>({
      label: 'Fecha',
      name: 'created_at',
      getValue: (row: SaleInterface) =>
        this.datePipe.transform(row.created_at, 'short') || '',
      options: { sortable: true },
    }),
    create_text_field<SaleInterface>({
      label: 'Cliente',
      getValue: (row: SaleInterface) =>
        row.customer
          ? `${row.customer.profile.first_name} ${row.customer.profile.last_name}`
          : 'N/A',
      onClick: (row: SaleInterface) =>
        this.router.navigate(['dashboard', 'customer'], {
          queryParams: { search: row.customer?.profile.first_name },
        }),
      options: { sortable: true, take_width: true },
    }),
    create_text_field<SaleInterface>({
      label: 'Total',
      name: 'total',
      getValue: (row: SaleInterface) => `${row.total} Bs.`,
      options: { sortable: true },
    }),
    create_text_field<SaleInterface>({
      label: 'Compras',
      getValue: (row: SaleInterface) => {
        const hasProducts = row.product_details.length > 0;
        const hasAppointments = row.appointment_details.length > 0;
        if (hasProducts && hasAppointments) return 'Productos y servicios';
        if (hasProducts) return 'Productos';
        if (hasAppointments) return 'Servicios';
        return 'Sin detalles';
      },
    }),
    create_table_field<SaleInterface, SalePaymentMethodBadge>({
      label: 'Método de pago',
      component: SalePaymentMethodBadge,
      getInputs: (row: SaleInterface) => ({
        payment_method: row.payment_method,
      }),
    }),

    create_table_field<SaleInterface, UiButton>({
      label: 'Ver detalles',
      component: UiButton,
      onClick: (row) => this.sale_detail_drawer_ref()?.open(row),
      getInputs: (row: SaleInterface) => ({
        _label: 'Ver detalles',
        variant: 'default',
        soft: true,
      }),
    }),
  ];

  filters: FilterBy[] = [
    {
      name: 'payment_method',
      label: 'Método de pago',
      show_value_on_badge: true,
      options: Object.entries(payment_methods_labeled).map(([value, label]) => ({
        label,
        value,
      })),
    },
  ];

  constructor() {
    const destroy_ref = inject(DestroyRef);
    this.saleService.listen_to_query_params(destroy_ref);
  }
}
