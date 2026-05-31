import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { TreatmentService } from '../../services/treatment.service';
import { TreatmentInterface } from '../../interfaces/treatment.interface';
import { TreatmentForm } from '../treatment-form/treatment-form';

@Component({
  selector: 'treatment-drawer',
  imports: [TreatmentForm],
  templateUrl: './treatment-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreatmentDrawer {
  treatmentService = inject(TreatmentService);
  drawerService = inject(DrawerService);

  template_drawer_create = viewChild.required<TemplateRef<any>>('drawer_create_content');
  template_drawer_update = viewChild.required<TemplateRef<any>>('drawer_update_content');

  treatment_form_create = viewChild<TreatmentForm>('treatment_form_create');
  treatment_form_update = viewChild<TreatmentForm>('treatment_form_update');

  open_drawer_create() {
    this.setup_and_open_drawer({
      title: 'Crear servicio',
      treatment: null,
      template: this.template_drawer_create(),
      on_submit: async () => this.treatment_form_create()?.on_submit(new SubmitEvent('submit')),
    });
  }

  open_drawer_update(treatment: TreatmentInterface) {
    this.setup_and_open_drawer({
      title: 'Editar servicio',
      treatment: treatment,
      template: this.template_drawer_update(),
      on_submit: async () => this.treatment_form_update()?.on_submit(new SubmitEvent('submit')),
    });
  }

  private setup_and_open_drawer(config: {
    title: string;
    treatment: TreatmentInterface | null;
    template: TemplateRef<any>;
    on_submit: () => Promise<boolean | void>;
  }) {
    this.treatmentService.selected_treatment.set(config.treatment);

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
      this.treatmentService.selected_treatment.set(null);
      this.drawerService.set_content(null);
    });
  }
}
