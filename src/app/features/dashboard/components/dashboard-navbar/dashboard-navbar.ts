import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { UiLogo } from '@/app/shared/ui/ui-logo/ui-logo';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiMode } from '@/app/shared/ui/ui-mode/ui-mode';
import { DashboardDropdownProfile } from '../dashboard-dropdown-profile/dashboard-dropdown-profile';
import BreakpointHelper from '@/app/shared/helpers/breakpoint';
import { Router } from '@angular/router';
import { NotificationDropdown } from '@/app/features/notification/components/notification-dropdown/notification-dropdown';
import { NotificationButton } from '@/app/features/notification/components/notification-button/notification-button';

@Component({
  selector: 'dashboard-navbar',
  imports: [UiLogo, UiButton, UiMode, DashboardDropdownProfile, NotificationButton],
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
