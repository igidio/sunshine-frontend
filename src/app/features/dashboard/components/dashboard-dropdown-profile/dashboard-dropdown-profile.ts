import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiDropdown } from '@/app/shared/ui/ui-dropdown/ui-dropdown';

@Component({
  selector: 'dashboard-dropdown-profile',
  imports: [UiButton, UiDropdown],
  templateUrl: './dashboard-dropdown-profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardDropdownProfile {}
