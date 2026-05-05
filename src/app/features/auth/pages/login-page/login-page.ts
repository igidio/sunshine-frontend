import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginForm } from '../../components/login-form/login-form';
import { LoginLogo } from '../../components/login-logo/login-logo';
import { UiModal } from '@/app/shared/ui/ui-modal/ui-modal';
import { LoginModalSignup } from '../../components/login-modal-signup/login-modal-signup';

@Component({
  selector: 'login-page',
  imports: [LoginForm, LoginLogo, UiModal, LoginModalSignup],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPage {}
