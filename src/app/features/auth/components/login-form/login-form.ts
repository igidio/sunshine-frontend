import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'login-form',
  imports: [],
  templateUrl: './login-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {}
