import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UiCheckbox } from '../../../../shared/ui/ui-checkbox/ui-checkbox';
import { UiButton } from '../../../../shared/ui/ui-button/ui-button';
import { UiCard } from '../../../../shared/ui/ui-card/ui-card';
import { LoginLogo } from '../login-logo/login-logo';
import { form } from '@angular/forms/signals';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';

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

  form = form(this.model);
}
