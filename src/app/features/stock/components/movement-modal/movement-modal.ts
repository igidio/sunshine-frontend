import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { ModalService } from '@/app/shared/services/modal.service';
import { MovementForm } from '../movement-form/movement-form';
import { MovementService } from '../../services/movement.service';

@Component({
  selector: 'movement-modal',
  imports: [MovementForm],
  templateUrl: './movement-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementModal {
  modalService = inject(ModalService);
  movementService = inject(MovementService);
  template_create_content = viewChild.required<TemplateRef<any>>('modal_create_content');
  movement_form_create = viewChild<MovementForm>('movement_form_create');

  open_create_modal() {
    this.setup_and_open_modal({
      title: 'Registrar movimiento',
      template: this.template_create_content(),
      on_submit: async () =>
        await this.movement_form_create?.()?.on_submit(new SubmitEvent('submit'))!,
    });
  }

  private setup_and_open_modal(config: {
    title: string;
    template: any;
    on_submit: () => Promise<boolean>;
  }) {
    this.modalService.set_header({
      title: config.title,
      show_close_button: true,
    });

    this.modalService.set_content(config.template);

    this.modalService.set_footer({
      right_buttons: [
        {
          label: 'Cerrar',
          variant: 'secondary',
          size: 'sm',
          action: () => {
            this.modalService.close();
          },
        },
        {
          label: 'Guardar',
          variant: 'success',
          size: 'sm',
          action: async () => {
            await config.on_submit().then((result) => result === true && this.modalService.close());
          },
        },
      ],
    });

    this.modalService.open();
  }
}
