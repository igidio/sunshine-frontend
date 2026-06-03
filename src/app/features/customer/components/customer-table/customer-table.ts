import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { UiTable } from '@/app/shared/ui/ui-table/ui-table';
import { create_table_field, create_text_field } from '@/app/shared/ui/ui-table/ui-table_helper';
import { CustomerInterface } from '../../interfaces/customer.interface';
import { CustomerService } from '../../services/customer.service';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { DashboardTableDropdown } from '@/app/features/dashboard/components/dashboard-table-dropdown/dashboard-table-dropdown';
import { CustomerDrawer } from '../customer-drawer/customer-drawer';
import { CustomerModal } from '../customer-modal/customer-modal';
import { CustomerExpandable } from '../customer-expandable/customer-expandable';
import { Router } from '@angular/router';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';

@Component({
  selector: 'customer-table',
  imports: [UiTable, UiButton, CustomerDrawer, CustomerModal],
  providers: [DatePipe],
  templateUrl: './customer-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerTable {
  private router = inject(Router);
  customerService = inject(CustomerService);
  private datePipe = inject(DatePipe);

  customer_drawer_ref = viewChild<CustomerDrawer>('customer_drawer');
  customer_modal_ref = viewChild<CustomerModal>('customer_modal');

  get can_manage_customers() {
    return this.customerService.can_manage_customers;
  }

  expandable_field = create_table_field<CustomerInterface, CustomerExpandable>({
    label: '',
    component: CustomerExpandable,
    getInputs: (row: CustomerInterface) => ({
      address: row.profile.address,
    }),
  });

  fields = computed(() => {
    const fields = [
      create_text_field<CustomerInterface>({
        label: 'Nombre completo',
        getValue: (row: CustomerInterface) => `${row.profile.first_name} ${row.profile.last_name}`,
      }),
      create_text_field<CustomerInterface>({
        label: 'Fecha de nacimiento',
        getValue: (row: CustomerInterface) =>
          this.datePipe.transform(row.profile.birth_date, 'shortDate') || 'N/A',
      }),
      create_text_field<CustomerInterface>({
        label: 'Número de teléfono',
        getValue: (row: CustomerInterface) => row.phone_number,
      }),
      create_table_field<CustomerInterface, UiButton>({
        label: 'Ventas',
        component: UiButton,
        onClick: (row) => {
          this.router.navigate(['/sales'], {
            queryParams: {
              customer_id: row.id,
            },
          });
        },
        getInputs: (row: CustomerInterface) => ({
          _label: 'Ver ventas',
          variant: 'secondary',
          size: 'sm',
        }),
      }),
      create_table_field<CustomerInterface, UiBadge>({
        label: 'Estado',
        component: UiBadge,
        getInputs: (row: CustomerInterface) => ({
          variant: row.disabled_at ? 'danger' : 'success',
          _label: row.disabled_at ? 'Deshabilitado' : 'Activo',
        }),
      }),
      create_text_field<CustomerInterface>({
        label: 'Fecha de creación',
        getValue: (row: CustomerInterface) =>
          this.datePipe.transform(row.created_at, 'short') || 'N/A',
      }),
    ];

    if (this.can_manage_customers()) {
      fields.push(
        create_table_field<CustomerInterface, DashboardTableDropdown>({
          label: 'Acciones',
          component: DashboardTableDropdown,
          getInputs: (row: CustomerInterface) => ({
            identifier: row.id.toString(),
            items: [
              [
                {
                  label: 'Editar',
                  icon: 'edit',
                  on_click: () => this.customer_drawer_ref()?.open_drawer_update(row),
                },
                {
                  label: row.disabled_at ? 'Habilitar' : 'Deshabilitar',
                  icon: row.disabled_at ? 'arrow_up' : 'arrow_down',
                  on_click: () => this.customer_modal_ref()?.open_disable_modal(row),
                },
                {
                  label: 'Eliminar',
                  icon: 'delete',
                  on_click: () => this.customer_modal_ref()?.open_delete_modal(row),
                },
              ],
            ],
          }),
        }),
      );
    }

    return fields;
  });
}
