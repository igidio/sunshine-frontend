import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { initModals, Modal } from 'flowbite';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'ui-modal',
  templateUrl: './ui-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiModal implements AfterViewInit {
  public modalService = inject(ModalService);
  modal_ref = viewChild<ElementRef>('modal');

  ngAfterViewInit() {
    initModals();

    const nativeElement = this.modal_ref()?.nativeElement;

    if (nativeElement) {
      const modal = new Modal(
        nativeElement,
        {
          onShow: () => console.log('Modal opened'),
          onHide: () => console.log('Modal closed'),
        },
        {
          id: 'default-modal',
          override: true,
        },
      );

      // Pasar la instancia "viva" al servicio global:
      this.modalService.register_modal(modal);
    }
  }
}
