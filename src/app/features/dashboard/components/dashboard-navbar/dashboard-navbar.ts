import { AfterViewInit, ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { UiLogo } from '@/app/shared/ui/ui-logo/ui-logo';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiMode } from '@/app/shared/ui/ui-mode/ui-mode';
import { DashboardDropdownProfile } from '../dashboard-dropdown-profile/dashboard-dropdown-profile';

@Component({
  selector: 'dashboard-navbar',
  imports: [UiLogo, UiButton, UiMode, DashboardDropdownProfile],
  templateUrl: './dashboard-navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNavbar implements AfterViewInit {
  collapse_sidebar = model.required<boolean>();

  ngAfterViewInit() {
    const stored_sidebar_status = localStorage.getItem('dashboard_sidebar_collapsed');
    this.collapse_sidebar.set(stored_sidebar_status === 'true');
  }

  toggle_collapse_sidebar(status?: boolean) {
    const sidebar_status = status ?? !this.collapse_sidebar();
    this.collapse_sidebar.set(sidebar_status);

    localStorage.setItem('dashboard_sidebar_collapsed', sidebar_status.toString());
  }
}
