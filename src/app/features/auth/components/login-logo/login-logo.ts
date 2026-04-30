import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiLogo } from '../../../../shared/ui/ui-logo/ui-logo';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'login-logo',
  imports: [UiLogo, RouterLink],
  templateUrl: './login-logo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginLogo {}
