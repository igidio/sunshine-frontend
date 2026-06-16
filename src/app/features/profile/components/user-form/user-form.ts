import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  debounce,
  email,
  form,
  maxLength,
  minLength,
  pattern,
  required,
  submit,
} from '@angular/forms/signals';
import { regex } from '@/app/shared/data/regex';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { AuthService } from '@/app/core/services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { UiTooltip } from '@/app/shared/ui/ui-tooltip/ui-tooltip';
import { SendConfirmation } from '../send-confirmation/send-confirmation';

@Component({
  selector: 'user-form',
  imports: [UiButton, UiField, UiInput, UiTooltip, SendConfirmation],
  templateUrl: './user-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm {
  private profileService = inject(ProfileService);
  authService = inject(AuthService);

  isSubmitting = signal(false);

  model = signal({
    username: this.authService.user()?.username ?? '',
    email: this.authService.user()?.email ?? '',
    phone_number: this.authService.user()?.phone_number?.toString() ?? '',
  });

  form = form(this.model, (schema_path) => {
    debounce(schema_path.username, 300);

    required(schema_path.username, {
      message: 'El nombre de usuario es requerido',
    });
    minLength(schema_path.username, 3, {
      message: 'El nombre de usuario debe tener al menos 3 caracteres',
    });
    pattern(schema_path.username, regex.username, {
      message:
        'El nombre de usuario solo puede contener letras, números, puntos, guiones bajos o guiones medios',
    });

    required(schema_path.email, {
      message: 'El correo electrónico es requerido',
    });
    email(schema_path.email, {
      message: 'El correo electrónico no es válido',
    });

    required(schema_path.phone_number, {
      message: 'El número de teléfono es requerido',
    });
    pattern(schema_path.phone_number, regex.phone_number, {
      message: 'Solo se permiten números',
    });
  });

  private default_values = computed(() => ({
    username: this.authService.user()?.username ?? '',
    email: this.authService.user()?.email ?? '',
    phone_number: this.authService.user()?.phone_number?.toString() ?? '',
  }));

  can_revert = computed(() => {
    const current = this.model();
    const defaults = this.default_values();
    return (
      current.username !== defaults.username ||
      current.email !== defaults.email ||
      current.phone_number !== defaults.phone_number
    );
  });

  revert() {
    this.model.set({ ...this.default_values() });
  }

  protected on_submit(event: SubmitEvent) {
    event.preventDefault();

    submit(this.form, async (f) => {
      this.isSubmitting.set(true);
      const values = f().value();

      await this.profileService.update_user({
        username: values.username,
        email: values.email,
        phone_number: values.phone_number,
      });

      this.isSubmitting.set(false);
    });
  }
}
