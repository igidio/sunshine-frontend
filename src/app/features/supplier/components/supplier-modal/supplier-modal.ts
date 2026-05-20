import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { ModalService } from '@/app/shared/services/modal.service';

@Component({
  selector: 'supplier-modal',
  imports: [],
  templateUrl: './supplier-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierModal {
  supplierService = inject(SupplierService);
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
}
