import { ElementRef, Injectable, signal, TemplateRef, viewChild } from '@angular/core';
import { Modal } from 'flowbite';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modal: Modal | null = null;

  register_modal(modal_instance: Modal) {
    this.modal = modal_instance;
  }

  open() {
    if (this.modal) {
      this.modal.show();
    } else {
      console.warn('El modal principal no ha sido registrado.');
    }
  }
  close() {
    if (this.modal) {
      this.modal.hide();
    }
  }
}
