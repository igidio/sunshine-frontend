import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiDropdown } from '@/app/shared/ui/ui-dropdown/ui-dropdown';
import { UiDropdownItem } from '@/app/shared/data/ui-types';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
  selector: 'dashboard-dropdown-profile',
  imports: [UiButton, UiDropdown],
  templateUrl: './dashboard-dropdown-profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardDropdownProfile {
  authService = inject(AuthService);

  items: UiDropdownItem[][] = [
    [
      {
        icon: 'profile',
        label: 'Ver perfil',
        href: '/profile',
      },
      {
        icon: 'logout',
        label: 'Cerrar sesión',
        on_click: () => {
          this.authService.logout();
        },
      },
    ],
  ];
}
