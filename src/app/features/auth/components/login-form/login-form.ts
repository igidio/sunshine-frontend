import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiCheckbox } from '../../../../shared/ui/ui-checkbox/ui-checkbox';
import { UiButton } from '../../../../shared/ui/ui-button/ui-button';
import { UiCard } from '../../../../shared/ui/ui-card/ui-card';
import { LoginLogo } from '../login-logo/login-logo';
import { debounce, form, minLength, pattern, required, schema } from '@angular/forms/signals';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { regex } from '@/app/shared/data/regex';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';

@Component({
  selector: 'login-form',
  imports: [UiCheckbox, UiButton, UiCard, LoginLogo, UiField, UiInput],
  templateUrl: './login-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {
  model = signal({
    username_or_email: '',
    password: '',
    remember_me: true,
  });

  form = form(this.model, (schema_path) => {
    debounce(schema_path.username_or_email, 300);
    required(schema_path.username_or_email, {
      message: 'El nombre de usuario / correo electrónico es requerido',
    });
    minLength(schema_path.password, 6, {
      message: 'La contraseña debe tener al menos 6 caracteres',
    });
    minLength(schema_path.username_or_email, 3, {
      message: 'El campo debe tener al menos 3 caracteres',
    });
    pattern(schema_path.username_or_email, regex.username_or_email, {
      message: 'Formato inválido',
    });
    required(schema_path.password, {
      message: 'La contraseña es requerida',
    });
  });
}
