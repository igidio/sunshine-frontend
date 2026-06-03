import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { AuthService } from '@/app/core/services/auth.service';
import { DashboardTableDropdown } from '@/app/features/dashboard/components/dashboard-table-dropdown/dashboard-table-dropdown';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiTable } from '@/app/shared/ui/ui-table/ui-table';
import { create_table_field, create_text_field } from '@/app/shared/ui/ui-table/ui-table_helper';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { TreatmentInterface } from '../../interfaces/treatment.interface';
import { TreatmentService } from '../../services/treatment.service';
import { TreatmentDrawer } from '../treatment-drawer/treatment-drawer';
import { TreatmentModal } from '../treatment-modal/treatment-modal';
import { TreatmentExpandable } from '../treatment-expandable/treatment-expandable';

@Component({
  selector: 'treatment-table',
  imports: [UiTable, UiButton, TreatmentDrawer, TreatmentModal],
  providers: [DatePipe],
  templateUrl: './treatment-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreatmentTable {
  treatmentService = inject(TreatmentService);
  authService = inject(AuthService);
  private datePipe = inject(DatePipe);

  treatment_drawer_ref = viewChild<TreatmentDrawer>('treatment_drawer');
  treatment_modal_ref = viewChild<TreatmentModal>('treatment_modal');

  get table_content(): PaginationResponseInterface<TreatmentInterface> | undefined {
    return this.treatmentService.treatments();
  }

  can_manage_treatments = this.authService.has_permission('TREATMENT');

  expandable_field = create_table_field<TreatmentInterface, TreatmentExpandable>({
    label: '',
    component: TreatmentExpandable,
    getInputs: (row: TreatmentInterface) => ({
      description: row.description,
    }),
  });

  fields = computed(() => {
    const fields = [
      create_text_field<TreatmentInterface>({
        label: 'Nombre del servicio',
        name: 'name',
        getValue: (row: TreatmentInterface) => row.name,
        options: { sortable: true },
      }),
      create_text_field<TreatmentInterface>({
        label: 'Precio',
        name: 'price',
        getValue: (row: TreatmentInterface) => row.price + ' Bs.',
        options: { sortable: true },
      }),
      create_text_field<TreatmentInterface>({
        label: 'Duración',
        name: 'duration',
        getValue: (row: TreatmentInterface) => row.duration + ' min.',
        options: { sortable: true },
      }),
      create_text_field<TreatmentInterface>({
        label: 'Fecha de creación',
        name: 'created_at',
        getValue: (row: TreatmentInterface) => this.datePipe.transform(row.created_at, 'short'),
        options: { sortable: true },
      }),
      create_table_field<TreatmentInterface, UiBadge>({
        label: 'Estado',
        component: UiBadge,
        getInputs: (row: TreatmentInterface) => ({
          variant: row.disabled_at ? 'danger' : 'success',
          _label: row.disabled_at ? 'Inhabilitado' : 'Activo',
        }),
      }),
    ];

    if (this.can_manage_treatments()) {
      fields.push(
        create_table_field<TreatmentInterface, DashboardTableDropdown>({
          label: 'Opciones',
          component: DashboardTableDropdown,
          getInputs: (row: TreatmentInterface) => ({
            identifier: row.id.toString(),
            items: [
              [
                {
                  label: 'Editar',
                  icon: 'edit',
                  on_click: () => this.treatment_drawer_ref()?.open_drawer_update(row),
                },
                {
                  label: row.disabled_at ? 'Habilitar' : 'Inhabilitar',
                  icon: row.disabled_at ? 'arrow_up' : 'arrow_down',
                  on_click: () => this.treatment_modal_ref()?.open_disable_modal(row),
                },
                {
                  label: 'Eliminar',
                  icon: 'delete',
                  on_click: () => this.treatment_modal_ref()?.open_delete_modal(row),
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
