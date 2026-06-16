import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  form,
  maxLength,
  pattern,
  required,
  submit,
} from '@angular/forms/signals';
import { regex } from '@/app/shared/data/regex';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { UiDatepicker } from '@/app/shared/ui/ui-datepicker/ui-datepicker';
import { AuthService } from '@/app/core/services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { UiTooltip } from "@/app/shared/ui/ui-tooltip/ui-tooltip";

@Component({
  selector: 'profile-form',
  imports: [UiButton, UiField, UiInput, UiDatepicker, UiTooltip],
  templateUrl: './profile-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileForm {
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);

  isSubmitting = signal(false);

  model = signal({
    first_name: this.authService.user()?.profile.first_name ?? '',
    last_name: this.authService.user()?.profile.last_name ?? '',
    birth_date: this.authService.user()?.profile.birth_date?.toString().split('T')[0] ?? '',
    address: this.authService.user()?.profile.address ?? '',
  });

  form = form(this.model, (schema_path) => {
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

  private default_values = computed(() => ({
    first_name: this.authService.user()?.profile.first_name ?? '',
    last_name: this.authService.user()?.profile.last_name ?? '',
    birth_date: this.authService.user()?.profile.birth_date?.toString().split('T')[0] ?? '',
    address: this.authService.user()?.profile.address ?? '',
  }));

  can_revert = computed(() => {
    const current = this.model();
    const defaults = this.default_values();
    return (
      current.first_name !== defaults.first_name ||
      current.last_name !== defaults.last_name ||
      current.birth_date !== defaults.birth_date ||
      current.address !== defaults.address
    );
  });

  revert() {
    this.model.set({ ...this.default_values() });
  }

  max_birth_date = computed(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
  });

  protected on_submit(event: SubmitEvent) {
    event.preventDefault();

    submit(this.form, async (f) => {
      this.isSubmitting.set(true);
      const values = f().value();

      await this.profileService.update({
        first_name: values.first_name,
        last_name: values.last_name,
        birth_date: values.birth_date,
        ...(values.address ? { address: values.address } : {}),
      });

      this.isSubmitting.set(false);
    });
  }
}
