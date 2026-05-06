import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginLogo } from '@/app/features/auth/components/login-logo/login-logo';
import { UiMode } from '@/app/shared/ui/ui-mode/ui-mode';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, LoginLogo, UiMode],
  templateUrl: './AuthLayout.html',
  styleUrl: './AuthLayout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export default class AuthLayout {}
