import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { AppointmentInterface } from '../../interfaces/appointment.interface';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentForm } from '../appointment-form/appointment-form';

@Component({
  selector: 'appointment-drawer',
  imports: [AppointmentForm],
  templateUrl: './appointment-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentDrawer {
  appointmentService = inject(AppointmentService);
  drawerService = inject(DrawerService);

  template_drawer_create = viewChild.required<TemplateRef<any>>('drawer_create_content');
  template_drawer_update = viewChild.required<TemplateRef<any>>('drawer_update_content');

  appointment_form_create = viewChild<AppointmentForm>('appointment_form_create');
  appointment_form_update = viewChild<AppointmentForm>('appointment_form_update');

  open_drawer_create() {
    this.setup_and_open_drawer({
      title: 'Crear cita',
      appointment: null,
      template: this.template_drawer_create(),
      on_submit: async () => this.appointment_form_create()?.on_submit(new SubmitEvent('submit')),
    });
  }

  open_drawer_update(appointment: AppointmentInterface) {
    this.setup_and_open_drawer({
      title: 'Editar cita',
      appointment,
      template: this.template_drawer_update(),
      on_submit: async () => this.appointment_form_update()?.on_submit(new SubmitEvent('submit')),
    });
  }

  private setup_and_open_drawer(config: {
    title: string;
    appointment: AppointmentInterface | null;
    template: TemplateRef<any>;
    on_submit: () => Promise<boolean | void>;
  }) {
    this.appointmentService.selected_appointment.set(config.appointment);

    this.drawerService.set_header({
      title: config.title,
      show_close_button: true,
      show_divider: true,
    });

    this.drawerService.set_content(config.template);

    this.drawerService.set_footer([
      {
        label: 'Cerrar',
        variant: 'secondary',
        size: 'sm',
        action: () => {
          this.drawerService.close();
        },
      },
      {
        label: 'Guardar',
        variant: 'success',
        size: 'sm',
        action: async () => {
          await config.on_submit().then((result) => result === true && this.drawerService.close());
        },
      },
    ]);

    this.drawerService.open();

    this.drawerService.set_on_close(() => {
      this.drawerService.set_content(null);
    });
  }
}
