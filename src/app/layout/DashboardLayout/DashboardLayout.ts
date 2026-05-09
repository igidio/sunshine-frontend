import { ChangeDetectionStrategy, Component, inject, input, model, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardNavbar } from '@/app/features/dashboard/components/dashboard-navbar/dashboard-navbar';
import { DashboardSidebar } from '@/app/features/dashboard/components/dashboard-sidebar/dashboard-sidebar';
import { UiBreadcrumb } from '@/app/shared/ui/ui-breadcrumb/ui-breadcrumb';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, DashboardNavbar, DashboardSidebar, UiBreadcrumb],
  templateUrl: './DashboardLayout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardLayout {
  dashboard = inject(DashboardService);
  collapse_sidebar = signal<boolean>(false);
}
