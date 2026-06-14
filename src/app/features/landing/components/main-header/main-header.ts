import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiLogo } from '../../../../shared/ui/ui-logo/ui-logo';
import { UiMode } from '../../../../shared/ui/ui-mode/ui-mode';
import { UiButton } from '../../../../shared/ui/ui-button/ui-button';
import { UiDropdown } from '../../../../shared/ui/ui-dropdown/ui-dropdown';
import { UiDropdownItem } from '../../../../shared/data/ui-types';

@Component({
  selector: 'main-header',
  imports: [RouterLink, UiLogo, UiMode, UiButton, UiDropdown],
  templateUrl: './main-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHeader {
  nav_items = signal<UiDropdownItem[][]>([
    [
      { label: 'Agendar citas', href: '/appointments' },
      { label: 'Ver productos', href: '/about' },
      { label: 'Mis ordenes', href: '/orders' },
    ],
  ]);
}
