import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiIcon } from '../../../../shared/ui/ui-icon/ui-icon';
import { UiLogo } from '../../../../shared/ui/ui-logo/ui-logo';
import { LandingLoginModal } from '../landing-login-modal/landing-login-modal';
import { LandingService } from '../../services/landing.service';

@Component({
  selector: 'main-footer',
  imports: [RouterLink, UiIcon, UiLogo, LandingLoginModal],
  templateUrl: './main-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainFooter {
  private landingService = inject(LandingService);

  get current_year(): number {
    return new Date().getFullYear();
  }

  navigate_protected(route: string) {
    this.landingService.navigate_protected(route);
  }
}
