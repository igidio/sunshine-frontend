import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiLogo } from '../../../../shared/ui/ui-logo/ui-logo';
import { RouterLink } from '@angular/router';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';

@Component({
  selector: 'login-logo',
  imports: [UiLogo, RouterLink, UiIcon],
  templateUrl: './login-logo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginLogo {
  is_contrast = input(false, {
    transform: booleanAttribute,
  });
}
