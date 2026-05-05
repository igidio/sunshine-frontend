import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { initModals, Modal } from 'flowbite';
import { ModalService } from '../../services/modal.service';
import { UiButton } from '../ui-button/ui-button';

@Component({
  selector: 'ui-modal',
  templateUrl: './ui-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, UiButton],
})
export class UiModal implements AfterViewInit {
  public modal_service = inject(ModalService);
  modal_ref = viewChild<ElementRef>('modal');

  ngAfterViewInit() {
    initModals();
    const native_element = this.modal_ref()?.nativeElement;
    if (native_element) {
      const modal = new Modal(native_element);
      this.modal_service.register_modal(modal);
    }
  }
}
