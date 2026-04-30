import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginForm } from '../../components/login-form/login-form';
import { LoginLogo } from '../../components/login-logo/login-logo';

@Component({
  selector: 'login-page',
  imports: [LoginForm, LoginLogo],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPage {}
