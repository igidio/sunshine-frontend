import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { debounce, email, form, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { UiSelect, SelectOption } from '@/app/shared/ui/ui-select/ui-select';
import { UiAlert } from '@/app/shared/ui/ui-alert/ui-alert';
import { ToastService } from '@/app/shared/services/toast.service';
import { ModalService } from '@/app/shared/services/modal.service';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
  selector: 'invite-form',
  imports: [UiButton, UiField, UiInput, UiSelect, UiAlert, RouterLink],
  templateUrl: './invite-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InviteForm {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private modalService = inject(ModalService);
  private authService = inject(AuthService);

  is_sending = signal(false);
  invite_token = signal<string | null>(null);

  role_options: SelectOption[] = [
    { value: 'admin', label: 'Administrador' },
    { value: 'employer', label: 'Empleado' },
  ];

  is_superuser = computed(() => this.authService.user()?.role === 'superuser');

  model = signal({
    email: '',
    role: '' as 'admin' | 'employer' | '',
  });

  form = form(this.model, (schema_path) => {
    debounce(schema_path.email, 300);

    required(schema_path.email, {
      message: 'El correo electrónico es requerido',
    });
    email(schema_path.email, {
      message: 'El correo electrónico no es válido',
    });
  });

  protected on_submit(event: SubmitEvent) {
    event.preventDefault();

    submit(this.form, async () => {
      this.is_sending.set(true);
      try {
        const { email, role } = this.model();

        const response = await firstValueFrom(
          this.http.post<{ token?: string; message?: string }>('/api/confirmation/invite', {
            email,
            ...(this.is_superuser() && role ? { role } : {}),
          }),
        );

        if (response && response.token) {
          this.invite_token.set(response.token);
        } else {
          this.toast.show({
            message: 'Invitación enviada correctamente',
            type: 'success',
            duration: 4000,
          });
          this.modalService.close();
        }
      } catch {
        this.toast.show({
          message: 'Error al enviar la invitación',
          type: 'danger',
          duration: 4000,
        });
      } finally {
        this.is_sending.set(false);
      }
    });
  }

  cancel() {
    this.modalService.close();
  }
}
