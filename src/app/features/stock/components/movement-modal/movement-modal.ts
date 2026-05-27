import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { ModalService } from '@/app/shared/services/modal.service';
import { MovementForm } from '../movement-form/movement-form';

@Component({
  selector: 'movement-modal',
  imports: [MovementForm],
  templateUrl: './movement-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementModal {
  modalService = inject(ModalService);
  template_create_content = viewChild.required<TemplateRef<any>>('modal_create_content');
  movement_form_create = viewChild<MovementForm>('movement_form_create');

  open_create_modal() {
    this.modalService.set_header({
      title: 'Registrar movimiento',
      show_close_button: true,
    });

    this.modalService.set_content(this.template_create_content());
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
      ],
    });
    this.modalService.open();
  }
}
