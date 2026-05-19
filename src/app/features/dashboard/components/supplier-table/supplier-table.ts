import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { create_table_field, create_text_field } from '@/app/shared/ui/ui-table/ui-table_helper';
import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { UiTable } from '@/app/shared/ui/ui-table/ui-table';
import { SupplierService } from '../../services/supplier.service';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';
import { DashboardTableDropdown } from '../dashboard-table-dropdown/dashboard-table-dropdown';
import { UiImage } from '@/app/shared/ui/ui-image/ui-image';
import { DatePipe } from '@angular/common';
import { UiDrawer } from '@/app/shared/ui/ui-drawer/ui-drawer';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'supplier-table',
  imports: [UiTable],
  providers: [DatePipe],
  templateUrl: './supplier-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierTable {
  supplierService = inject(SupplierService);
  private datePipe = inject(DatePipe);
  drawerService = inject(DrawerService);
  modalService = inject(ModalService);

  template_delete_content = viewChild.required<TemplateRef<any>>('delete_content');
  template_disable_content = viewChild.required<TemplateRef<any>>('disable_content');

  open_delete_modal(supplier: SupplierInterface) {
    this.supplierService.selected_supplier.set(supplier);
    this.modalService.set_header({
      title: `Eliminar proveedor`,
      show_close_button: true,
    });
    this.modalService.set_content(this.template_delete_content());
    this.modalService.set_footer({
      right_buttons: [
        {
          label: 'Cancelar',
          variant: 'secondary',
          size: 'md',
          action: () => {
            this.modalService.close();
          },
        },
        {
          label: 'Eliminar',
          variant: 'danger',
          size: 'md',
          action: async () => {
            await this.supplierService.delete(supplier.id);
            this.modalService.close();
          },
        },
      ],
    });
    this.modalService.open();
  }

  open_disable_modal(supplier: SupplierInterface) {
    this.supplierService.selected_supplier.set(supplier);
    this.modalService.set_header({
      title: `${supplier.disabled_at ? 'Habilitar' : 'Deshabilitar'} proveedor`,
      show_close_button: true,
    });
    this.modalService.set_content(this.template_disable_content());
    this.modalService.set_footer({
      right_buttons: [
        {
          label: 'Cancelar',
          variant: 'secondary',
          size: 'md',
          action: () => {
            this.modalService.close();
          },
        },
        {
          label: supplier.disabled_at ? 'Habilitar' : 'Deshabilitar',
          variant: supplier.disabled_at ? 'success' : 'danger',
          size: 'md',
          action: async () => {
            await this.supplierService.disable(supplier.id);
            this.modalService.close();
          },
        },
      ],
    });
    this.modalService.open();
  }

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
            { label: 'Editar', icon: 'edit', on_click: () => console.log('Editar' + row.id) },
            {
              label: row.disabled_at ? 'Habilitar' : 'Deshabilitar',
              icon: row.disabled_at ? 'arrow_up' : 'arrow_down',
              on_click: () => this.open_disable_modal(row),
            },
            { label: 'Eliminar', icon: 'delete', on_click: () => this.open_delete_modal(row) },
          ],
        ],
      }),
    }),
  ];
}
