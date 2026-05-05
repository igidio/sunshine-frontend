import { ModalService } from '@/app/shared/services/modal.service';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'login-modal-signup',
  imports: [],
  templateUrl: './login-modal-signup.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalSignup {
  public modal_service = inject(ModalService);

  content_template = viewChild.required<TemplateRef<any>>('content');

  open_modal() {
    this.modal_service.set_header({
      title: this.label(),
      show_close_button: true,
    });
    this.modal_service.set_content(this.content_template());
    this.modal_service.set_footer({
      right_buttons: [
        {
          label: 'Aceptar',
          variant: 'default',
          size: 'md',
          action: () => {
            this.modal_service.close();
          },
        },
      ],
    });
    this.modal_service.open();
  }

  label = signal<string>('¿Deseas registrarte?');
}
