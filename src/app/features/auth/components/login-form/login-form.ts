import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { debounce, form, minLength, pattern, required } from '@angular/forms/signals';
import { regex } from '@/app/shared/data/regex';
import { UiCheckbox } from '@/app/shared/ui/ui-checkbox/ui-checkbox';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { LoginLogo } from '../login-logo/login-logo';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { UiTooltip } from '@/app/shared/ui/ui-tooltip/ui-tooltip';
import { LoginModalSignup } from '../login-modal-signup/login-modal-signup';

@Component({
  selector: 'login-form',
  imports: [UiCheckbox, UiButton, UiCard, LoginLogo, UiField, UiInput, UiTooltip, LoginModalSignup],
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
      when: (model) => !!schema_path.username_or_email,
    });
  });

  password_input_show = signal<boolean>(false);

  password_field_status = computed(() =>
    this.password_input_show()
      ? {
          type: 'text',
          label: 'Ocultar contraseña',
          placeholder: 'Tu contraseña (pulsa el botón para ocultar)',
        }
      : { type: 'password', label: 'Mostrar contraseña', placeholder: 'Tu contraseña (•••••••••)' },
  );

  toggle_password_visibility() {
    this.password_input_show.update((current) => {
      const show = !current;
      return show;
    });
  }
}
