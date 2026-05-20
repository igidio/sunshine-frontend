import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { create_table_field, create_text_field } from '@/app/shared/ui/ui-table/ui-table_helper';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { UiTable } from '@/app/shared/ui/ui-table/ui-table';
import { SupplierService } from '../../services/supplier.service';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';
import { UiImage } from '@/app/shared/ui/ui-image/ui-image';
import { DatePipe } from '@angular/common';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { SupplierDrawer } from '@/app/features/supplier/components/supplier-drawer/supplier-drawer';
import { DashboardTableDropdown } from '@/app/features/dashboard/components/dashboard-table-dropdown/dashboard-table-dropdown';
import { SupplierModal } from '../supplier-modal/supplier-modal';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';

@Component({
  selector: 'supplier-table',
  imports: [UiTable, SupplierDrawer, SupplierModal, UiButton],
  providers: [DatePipe],
  templateUrl: './supplier-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierTable {
  supplierService = inject(SupplierService);
  private datePipe = inject(DatePipe);
  drawerService = inject(DrawerService);
  modalService = inject(ModalService);

  supplier_drawer_ref = viewChild<SupplierDrawer>('supplier_drawer');
  supplier_modal_ref = viewChild<SupplierModal>('supplier_modal');

  fields = [
    // create_text_field<SupplierInterface>({
    //   label: 'ID',
    //   name: 'id',
    //   getValue: (row: SupplierInterface) => row.id,
    // }),

    create_table_field<SupplierInterface, UiImage>({
      label: 'Imagen',
      name: 'image_url',
      component: UiImage,
      getInputs: (row: SupplierInterface) => ({
        url: row.image_url,
        placeholder: 'supplier',
        height: 3,
        is_square: true,
      }),
    }),
    create_text_field<SupplierInterface>({
      label: 'Nombre',
      name: 'name',
      getValue: (row: SupplierInterface) => row.name,
      options: { sortable: true },
    }),
    create_text_field<SupplierInterface>({
      label: 'Correo Electrónico',
      name: 'email',
      getValue: (row: SupplierInterface) => row.email,
    }),
    create_text_field<SupplierInterface>({
      label: 'Número de Teléfono',
      name: 'phone_number',
      getValue: (row: SupplierInterface) => row.phone_number,
    }),
    create_text_field<SupplierInterface>({
      label: 'Fecha de Creación',
      name: 'created_at',
      getValue: (row: SupplierInterface) => this.datePipe.transform(row.created_at, 'short'),
    }),
    create_table_field<SupplierInterface, UiBadge>({
      label: 'Estado',
      component: UiBadge,
      getInputs: (row: SupplierInterface) => ({
        variant: row.disabled_at ? 'danger' : 'success',
        _label: row.disabled_at ? 'Deshabilitado' : 'Activo',
      }),
    }),
    create_table_field<SupplierInterface, DashboardTableDropdown>({
      label: 'Acciones',
      component: DashboardTableDropdown,
      getInputs: (row: SupplierInterface) => ({
        identifier: row.id.toString(),
        items: [
          [
            {
              label: 'Editar',
              icon: 'edit',
              on_click: () => this.supplier_drawer_ref()?.open_drawer_update(row),
            },
            {
              label: row.disabled_at ? 'Habilitar' : 'Deshabilitar',
              icon: row.disabled_at ? 'arrow_up' : 'arrow_down',
              on_click: () => this.supplier_modal_ref()?.open_disable_modal(row),
            },
            {
              label: 'Eliminar',
              icon: 'delete',
              on_click: () => this.supplier_modal_ref()?.open_delete_modal(row),
            },
          ],
        ],
      }),
    }),
  ];
}
