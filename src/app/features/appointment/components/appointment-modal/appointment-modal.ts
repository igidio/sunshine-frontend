import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { ModalService } from '@/app/shared/services/modal.service';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentInterface } from '../../interfaces/appointment.interface';

@Component({
  selector: 'appointment-modal',
  imports: [],
  templateUrl: './appointment-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentModal {
  appointmentService = inject(AppointmentService);
  modalService = inject(ModalService);

  template_delete_content = viewChild.required<TemplateRef<any>>('delete_content');

  get selected_appointment(): AppointmentInterface | null {
    return this.appointmentService.selected_appointment();
  }

  open_delete_modal(appointment: AppointmentInterface) {
    this.appointmentService.selected_appointment.set(appointment);

    this.modalService.set_header({
      title: 'Eliminar cita',
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
            await this.appointmentService.delete(appointment.id);
            this.modalService.close();
          },
        },
      ],
    });

    this.modalService.open();
  }

  get customer_name(): string {
    const customer = this.selected_appointment?.customer;

    if (!customer) {
      return '';
    }

    return `${customer.profile?.first_name || ''} ${customer.profile?.last_name || ''}`.trim();
  }
}
