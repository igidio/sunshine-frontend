import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { UiLogo } from '@/app/shared/ui/ui-logo/ui-logo';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiMode } from '@/app/shared/ui/ui-mode/ui-mode';
import { DashboardDropdownProfile } from '../dashboard-dropdown-profile/dashboard-dropdown-profile';
import { UiDropdown } from '@/app/shared/ui/ui-dropdown/ui-dropdown';

@Component({
  selector: 'dashboard-navbar',
  imports: [UiLogo, UiButton, UiMode, DashboardDropdownProfile],
  templateUrl: './dashboard-navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNavbar {
  collapse_sidebar = model.required<boolean>();

  toggle_collapse_sidebar(status?: boolean) {
    this.collapse_sidebar.set(status ?? !this.collapse_sidebar());
  }
}
