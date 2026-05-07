import { IconValue } from '@/app/shared/data/icons';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';

@Component({
  selector: 'dashboard-sidebar',
  imports: [UiIcon],
  templateUrl: './dashboard-sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .fade-in {
      animation: fadeIn 0.2s ease-in;
    }
    .fade-out {
      animation: fadeOut 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `,
})
export class DashboardSidebar {
  collapse_sidebar = input.required<boolean>();
  items: { label: string; icon: IconValue; route: string }[] = [
    { label: 'Inicio', icon: 'home', route: '/dashboard/home' },
    { label: 'Perfil', icon: 'profile', route: '/dashboard/profile' },
    { label: 'Ajustes', icon: 'close', route: '/dashboard/settings' },
  ];
}
