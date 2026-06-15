import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { debounce, form, minLength, pattern, required, submit } from '@angular/forms/signals';
import { regex } from '@/app/shared/data/regex';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { UiTooltip } from '@/app/shared/ui/ui-tooltip/ui-tooltip';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@/app/core/services/auth.service';
import { ToastService } from '@/app/shared/services/toast.service';

@Component({
  selector: 'signup-form',
  imports: [UiButton, UiField, UiInput, UiTooltip],
  templateUrl: './signup-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupForm {
  authService = inject(AuthService);
  toastService = inject(ToastService);

  model = signal({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    repeat_password: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    address: '',
  });

  form = form(this.model, (schema_path) => {
    debounce(schema_path.username, 300);

    required(schema_path.username, {
      message: 'El nombre de usuario es requerido',
    });
    minLength(schema_path.username, 3, {
      message: 'El nombre de usuario debe tener al menos 3 caracteres',
    });

    required(schema_path.email, {
      message: 'El correo electrónico es requerido',
    });
    pattern(schema_path.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: 'Formato de correo electrónico inválido',
    });

    required(schema_path.phone_number, {
      message: 'El número de teléfono es requerido',
    });
    pattern(schema_path.phone_number, regex.phone_number, {
      message: 'Solo se permiten números',
    });

    required(schema_path.password, {
      message: 'La contraseña es requerida',
    });
    minLength(schema_path.password, 6, {
      message: 'La contraseña debe tener al menos 6 caracteres',
    });

    // required(schema_path.repeat_password, {
    //   message: 'Debe repetir la contraseña',
    //   when: (model) => !!schema_path.password.value(model),
    // });

    required(schema_path.first_name, {
      message: 'El nombre es requerido',
    });

    required(schema_path.last_name, {
      message: 'El apellido es requerido',
    });

    required(schema_path.birth_date, {
      message: 'La fecha de nacimiento es requerida',
    });
    pattern(schema_path.birth_date, regex.birth_date, {
      message: 'Formato de fecha inválido (YYYY-MM-DD)',
    });
  });

  password_input_show = signal<boolean>(false);
  repeat_password_input_show = signal<boolean>(false);

  password_field_status = computed(() =>
    this.password_input_show()
      ? { type: 'text', label: 'Ocultar contraseña', placeholder: 'Tu contraseña' }
      : { type: 'password', label: 'Mostrar contraseña', placeholder: 'Tu contraseña (•••••••••)' },
  );

  repeat_password_field_status = computed(() =>
    this.repeat_password_input_show()
      ? { type: 'text', label: 'Ocultar contraseña', placeholder: 'Repite tu contraseña' }
      : { type: 'password', label: 'Mostrar contraseña', placeholder: 'Repite tu contraseña (•••••••••)' },
  );

  toggle_password_visibility() {
    this.password_input_show.update((current) => !current);
  }

  toggle_repeat_password_visibility() {
    this.repeat_password_input_show.update((current) => !current);
  }

  protected on_submit(event: SubmitEvent) {
    event.preventDefault();

    submit(this.form, async (f) => {
      const values = f().value();

      if (values.password !== values.repeat_password) {
        this.toastService.show({
          message: 'Las contraseñas no coinciden',
          duration: 4000,
          type: 'danger',
        });
        return;
      }

      const payload = {
        user: {
          username: values.username,
          password: values.password,
          email: values.email,
          phone_number: values.phone_number,
        },
        profile: {
          first_name: values.first_name,
          last_name: values.last_name,
          birth_date: values.birth_date,
          ...(values.address ? { address: values.address } : {}),
        },
      };

      await firstValueFrom(this.authService.signup(payload));
      this.toastService.show({
        message: 'Registro exitoso',
        duration: 3000,
        type: 'success',
      });
    });
  }
}
