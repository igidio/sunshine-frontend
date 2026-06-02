import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UiTable } from '@/app/shared/ui/ui-table/ui-table';
import { create_table_field, create_text_field } from '@/app/shared/ui/ui-table/ui-table_helper';
import { DashboardTableDropdown } from '@/app/features/dashboard/components/dashboard-table-dropdown/dashboard-table-dropdown';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentInterface } from '../../interfaces/appointment.interface';
import { AppointmentExpandable } from '../appointment-expandable/appointment-expandable';
import { AppointmentDrawer } from '../appointment-drawer/appointment-drawer';
import { AppointmentModal } from '../appointment-modal/appointment-modal';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';

@Component({
  selector: 'appointment-table',
  imports: [UiTable, UiButton, AppointmentDrawer, AppointmentModal],
  templateUrl: './appointment-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class AppointmentTable {
  appointmentService = inject(AppointmentService);
  datePipe = inject(DatePipe);
  router = inject(Router);

  appointment_drawer_ref = viewChild<AppointmentDrawer>('appointment_drawer');
  appointment_modal_ref = viewChild<AppointmentModal>('appointment_modal');

  expandable = create_table_field<AppointmentInterface, AppointmentExpandable>({
    label: 'Información Adicional',
    component: AppointmentExpandable,
    getInputs: (row: AppointmentInterface) => ({
      notes: row.notes,
    }),
  });

  fields = [
    create_text_field<AppointmentInterface>({
      label: 'Servicio',
      name: 'treatment_id',
      getValue: (row: AppointmentInterface) => row.treatment?.name ?? 'N/A',
      onClick: (row: AppointmentInterface) =>
        this.router.navigate(['dashboard', 'treatment'], {
          queryParams: { search: row.treatment?.name },
        }),
      options: { sortable: true, take_width: true },
    }),
    create_text_field<AppointmentInterface>({
      label: 'Cliente',
      name: 'customer_id',
      getValue: (row: AppointmentInterface) =>
        row.customer
          ? `${row.customer.profile.first_name} ${row.customer.profile.last_name}`
          : 'N/A',
      onClick: (row: AppointmentInterface) =>
        this.router.navigate(['dashboard', 'customer'], {
          queryParams: { search: row.customer?.profile.first_name },
        }),
      options: { sortable: true },
    }),
    create_text_field<AppointmentInterface>({
      label: 'Fecha',
      name: 'date',
      getValue: (row: AppointmentInterface) => row.date,
      options: { sortable: true },
    }),
    create_text_field<AppointmentInterface>({
      label: 'Hora',
      getValue: (row: AppointmentInterface) =>
        `${row.time_start.slice(0, 5)} - ${row.time_end.slice(0, 5)}`,
      options: { sortable: true },
    }),
    create_text_field<AppointmentInterface>({
      label: 'Fecha de Creación',
      name: 'created_at',
      getValue: (row: AppointmentInterface) =>
        this.datePipe.transform(row.created_at, 'short') ?? '',
      options: { sortable: true },
    }),
    create_table_field<AppointmentInterface, DashboardTableDropdown>({
      label: 'Acciones',
      component: DashboardTableDropdown,
      getInputs: (row: AppointmentInterface) => ({
        identifier: row.id.toString(),
        items: [
          [
            {
              label: 'Editar',
              icon: 'edit',
              on_click: () => this.appointment_drawer_ref()?.open_drawer_update(row),
            },
            {
              label: 'Eliminar',
              icon: 'delete',
              on_click: () => this.appointment_modal_ref()?.open_delete_modal(row),
            },
          ],
        ],
      }),
    }),
  ];
}
