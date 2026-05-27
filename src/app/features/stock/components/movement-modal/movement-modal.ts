import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ModalService } from '@/app/shared/services/modal.service';

@Component({
  selector: 'movement-modal',
  imports: [],
  templateUrl: './movement-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementModal {
  modalService = inject(ModalService);

  open_create_modal() {
    this.modalService.set_header({
      title: 'Crear movimiento',
      show_close_button: true,
    });
    this.modalService.open();
  }
}
