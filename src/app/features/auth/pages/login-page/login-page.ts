import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginForm } from '../../components/login-form/login-form';
import { UiCard } from "@/app/shared/ui/ui-card/ui-card";
@Component({
  selector: 'login-page',
  imports: [LoginForm, UiCard],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPage { }
