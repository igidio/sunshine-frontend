import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AuthService } from '@/app/core/services/auth.service';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiDropdown } from '@/app/shared/ui/ui-dropdown/ui-dropdown';
import { UiDropdownItem } from '@/app/shared/data/ui-types';

@Component({
  selector: 'shared-dropdown-profile',
  imports: [UiButton, UiDropdown],
  templateUrl: './dropdown-profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownProfile {
  authService = inject(AuthService);

  from_dashboard = input(false);

  get items(): UiDropdownItem[][] {
    return [
      [
        {
          icon: 'profile',
          label: 'Ver perfil',
          href: this.from_dashboard() ? '/dashboard/profile' : '/profile',
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
}
