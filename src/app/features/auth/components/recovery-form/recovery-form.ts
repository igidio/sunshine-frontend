import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
  TemplateRef,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { debounce, email, form, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';
import { ToastService } from '@/app/shared/services/toast.service';
import { ModalService } from '@/app/shared/services/modal.service';

interface RecoveryResponse {
  token?: string;
  message?: string;
}

@Component({
  selector: 'recovery-form',
  imports: [UiButton, UiField, UiInput, UiIcon, RouterLink],
  templateUrl: './recovery-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoveryForm {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastService);
  private modalService = inject(ModalService);

  model = signal({ email: '' });

  form = form(this.model, (schema_path) => {
    debounce(schema_path.email, 300);

    required(schema_path.email, {
      message: 'El correo electrónico es requerido',
    });
    email(schema_path.email, {
      message: 'El correo electrónico no es válido',
    });
  });

  is_sending = signal(false);
  recovery_token = signal<string | null>(null);

  private recovery_modal = viewChild.required<TemplateRef<any>>('recovery_modal');

  protected on_submit(event: SubmitEvent) {
    event.preventDefault();

    submit(this.form, async () => {
      this.is_sending.set(true);
      try {
        const response = await firstValueFrom(
          this.http.post<{ token?: string, message?: string }>('/api/confirmation/password', {
            email: this.model().email,
          }),
        );

        if (response && response.token) {
          this.recovery_token.set(response.token);
          this.modalService.open();
          this.modalService.set_header({ title: 'Recuperar contraseña' });
          this.modalService.set_content(this.recovery_modal());
          this.modalService.set_footer({
            right_buttons: [
              {
                label: 'Cerrar',
                action: () => this.modalService.close(),
                variant: 'secondary',
                size: 'md',
              },
            ],
          });
        } else {
          this.toast.show({
            message: response?.message ?? 'Correo de recuperación enviado. Revisa tu bandeja de entrada.',
            type: 'success',
            duration: 5000,
          });
          this.router.navigate(['/auth/login']);
        }
      } catch {
        this.toast.show({
          message: 'Error al enviar el correo de recuperación',
          type: 'danger',
          duration: 4000,
        });
      } finally {
        this.is_sending.set(false);
      }
    });
  }
}
