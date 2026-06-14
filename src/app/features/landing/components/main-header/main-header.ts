import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButton } from '../../../../shared/ui/ui-button/ui-button';
import { UiDropdown } from '../../../../shared/ui/ui-dropdown/ui-dropdown';
import { UiDropdownItem } from '../../../../shared/data/ui-types';
import { UiLogo } from '../../../../shared/ui/ui-logo/ui-logo';
import { UiMode } from '../../../../shared/ui/ui-mode/ui-mode';
import { LandingLoginModal } from '../landing-login-modal/landing-login-modal';
import { LandingService } from '../../services/landing.service';

@Component({
  selector: 'main-header',
  imports: [RouterLink, UiLogo, UiMode, UiButton, UiDropdown, LandingLoginModal],
  templateUrl: './main-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHeader {
  private landingService = inject(LandingService);

  nav_items = signal<UiDropdownItem[][]>([
    [
      {
        label: 'Agendar citas',
        on_click: () => this.landingService.navigate_protected('/appointments'),
      },
      { label: 'Ver productos', href: '/about' },
      {
        label: 'Mis ordenes',
        on_click: () => this.landingService.navigate_protected('/orders'),
      },
    ],
  ]);
}
