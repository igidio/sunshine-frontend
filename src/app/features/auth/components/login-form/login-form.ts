import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiInput } from '../../../../shared/ui/ui-input/ui-input';
import { UiField } from '../../../../shared/ui/ui-field/ui-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UiCheckbox } from '../../../../shared/ui/ui-checkbox/ui-checkbox';

@Component({
  selector: 'login-form',
  imports: [UiInput, UiField, ReactiveFormsModule, UiCheckbox],
  templateUrl: './login-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {
  form = new FormGroup({
    username_or_email: new FormControl(''),
    password: new FormControl(''),
    remember_me: new FormControl(true),
  });
}
