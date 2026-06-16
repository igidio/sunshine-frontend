import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  form,
  minLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'password-form',
  imports: [UiButton, UiField, UiInput],
  templateUrl: './password-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordForm {
  private profileService = inject(ProfileService);

  isSubmitting = signal(false);

  model = signal({
    current_password: '',
    password: '',
    repeat_password: '',
  });

  form = form(this.model, (schema_path) => {
    required(schema_path.current_password, {
      message: 'La contraseña actual es requerida',
    });

    required(schema_path.password, {
      message: 'La nueva contraseña es requerida',
    });
    minLength(schema_path.password, 6, {
      message: 'La contraseña debe tener al menos 6 caracteres',
    });

    validate(schema_path.repeat_password, ({ value, valueOf }) => {
      const repeat_password = value();
      const password = valueOf(schema_path.password);

      if (repeat_password !== password) {
        return {
          kind: 'password_mismatch',
          message: 'Las contraseñas no coinciden',
        };
      }
      return null;
    });
  });

  protected on_submit(event: SubmitEvent) {
    event.preventDefault();

    submit(this.form, async (f) => {
      this.isSubmitting.set(true);
      const values = f().value();

      await this.profileService.update_password({
        current_password: values.current_password,
        password: values.password,
      });

      this.model.set({
        current_password: '',
        password: '',
        repeat_password: '',
      });

      this.isSubmitting.set(false);
    });
  }
}
