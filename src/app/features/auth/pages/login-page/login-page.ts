import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginForm } from '../../components/login-form/login-form';

@Component({
  selector: 'login-page',
  imports: [LoginForm],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPage {}
