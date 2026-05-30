import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { CustomerInterface } from '../../interfaces/customer.interface';
import { ModalService } from '@/app/shared/services/modal.service';

@Component({
  selector: 'customer-modal',
  imports: [],
  templateUrl: './customer-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerModal {
  customerService = inject(CustomerService);
  modalService = inject(ModalService);
  template_delete_content = viewChild.required<TemplateRef<any>>('delete_content');
  template_disable_content = viewChild.required<TemplateRef<any>>('disable_content');

  open_delete_modal(customer: CustomerInterface) {
    this.customerService.selected_customer.set(customer);
    this.modalService.set_header({
      title: 'Eliminar cliente',
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
            await this.customerService.delete(customer.id);
            this.modalService.close();
          },
        },
      ],
    });
    this.modalService.open();
  }

  open_disable_modal(customer: CustomerInterface) {
    this.customerService.selected_customer.set(customer);
    this.modalService.set_header({
      title: `${customer.disabled_at ? 'Habilitar' : 'Deshabilitar'} cliente`,
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
          label: customer.disabled_at ? 'Habilitar' : 'Deshabilitar',
          variant: customer.disabled_at ? 'success' : 'danger',
          size: 'md',
          action: async () => {
            await this.customerService.disable(customer.id);
            this.modalService.close();
          },
        },
      ],
    });
    this.modalService.open();
  }
}
