import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardNavbar } from '@/app/features/dashboard/components/dashboard-navbar/dashboard-navbar';
import { DashboardSidebar } from '@/app/features/dashboard/components/dashboard-sidebar/dashboard-sidebar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, DashboardNavbar, DashboardSidebar],
  templateUrl: './DashboardLayout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardLayout {
  collapse_sidebar = signal<boolean>(false);
}
