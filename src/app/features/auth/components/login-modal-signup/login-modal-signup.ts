import { ModalService } from '@/app/shared/services/modal.service';
import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { Modal } from 'flowbite';

@Component({
  selector: 'login-modal-signup',
  imports: [],
  templateUrl: './login-modal-signup.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalSignup {
  public modal_service = inject(ModalService);
  open_modal() {
    this.modal_service.open();
  }
}
