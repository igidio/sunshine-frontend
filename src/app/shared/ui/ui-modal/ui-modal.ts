import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
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
  buttons_disabled = signal(false);

  ngAfterViewInit() {
    initModals();
    const native_element = this.modal_ref()?.nativeElement;
    if (native_element) {
      const modal = new Modal(native_element, {
        onHide: () => this.modal_service.close(),
      });
      this.modal_service.register_modal(modal);
    }
  }

  async on_button_click(action: () => void | Promise<void>) {
    this.buttons_disabled.set(true);
    await action();
    this.buttons_disabled.set(false);
  }
}
