import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiDropdown } from '@/app/shared/ui/ui-dropdown/ui-dropdown';
import { UiDropdownItem } from '@/app/shared/data/ui-types';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';

@Component({
  selector: 'dashboard-dropdown-profile',
  imports: [UiButton, UiDropdown],
  templateUrl: './dashboard-dropdown-profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardDropdownProfile {
  items: UiDropdownItem[][] = [
    [
      {
        icon: 'profile',
        label: 'Ver perfil',
        href: '/profile',
      },
      {
        label: 'Cerrar sesión',
        href: '/logout',
      },
    ],
  ];
}
