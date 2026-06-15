import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { debounce, email, form, maxLength, minLength, pattern, required, submit, validate } from '@angular/forms/signals';
import { regex } from '@/app/shared/data/regex';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { UiDatepicker } from '@/app/shared/ui/ui-datepicker/ui-datepicker';
import { UiTooltip } from '@/app/shared/ui/ui-tooltip/ui-tooltip';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@/app/core/services/auth.service';
import { ToastService } from '@/app/shared/services/toast.service';

@Component({
  selector: 'signup-form',
  imports: [UiButton, UiField, UiInput, UiTooltip, UiDatepicker],
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
    pattern(schema_path.username, regex.username, {
      message: 'El nombre de usuario solo puede contener letras, números, puntos, guiones bajos o guiones medios',
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

    required(schema_path.password, {
      message: 'La contraseña es requerida',
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
        }
      }
      return null;
    });

    required(schema_path.first_name, {
      message: 'El nombre es requerido',
    });
    maxLength(schema_path.first_name, 255, {
      message: 'El nombre no puede tener más de 255 caracteres',
    });

    required(schema_path.last_name, {
      message: 'El apellido es requerido',
    });
    maxLength(schema_path.last_name, 255, {
      message: 'El apellido no puede tener más de 255 caracteres',
    });

    maxLength(schema_path.address, 255, {
      message: 'La dirección no puede tener más de 255 caracteres',
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
      : { type: 'password', label: 'Mostrar contraseña', placeholder: 'Tu contraseña' },
  );

  repeat_password_field_status = computed(() =>
    this.repeat_password_input_show()
      ? { type: 'text', label: 'Ocultar contraseña', placeholder: 'Repite tu contraseña' }
      : { type: 'password', label: 'Mostrar contraseña', placeholder: 'Repite tu contraseña' },
  );

  max_birth_date = computed(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
  });

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
