import { IconValue } from '@/app/shared/data/icons';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';

@Component({
  selector: 'dashboard-sidebar',
  imports: [UiIcon],
  templateUrl: './dashboard-sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSidebar {
  items: { label: string; icon: IconValue; route: string }[] = [
    { label: 'Inicio', icon: 'home', route: '/dashboard/home' },
    { label: 'Perfil', icon: 'profile', route: '/dashboard/profile' },
    { label: 'Ajustes', icon: 'close', route: '/dashboard/settings' },
  ];
}
