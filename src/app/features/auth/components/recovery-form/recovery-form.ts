import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { debounce, email, form, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { ToastService } from '@/app/shared/services/toast.service';

@Component({
  selector: 'recovery-form',
  imports: [UiButton, UiField, UiInput, RouterLink],
  templateUrl: './recovery-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoveryForm {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastService);

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

  protected on_submit(event: SubmitEvent) {
    console.log("sdasda");

    event.preventDefault();

    submit(this.form, async () => {
      this.is_sending.set(true);
      try {
        await firstValueFrom(
          this.http.post('/api/confirmation/password', {
            email: this.model().email,
          }),
        );
        this.toast.show({
          message: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.',
          type: 'success',
          duration: 5000,
        });
        this.router.navigate(['/auth/login']);
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
