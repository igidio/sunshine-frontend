import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { UiDropdown } from '@/app/shared/ui/ui-dropdown/ui-dropdown';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiDropdownItem } from '@/app/shared/data/ui-types';

@Component({
  selector: 'dashboard-table-dropdown',
  imports: [UiDropdown, UiButton],
  templateUrl: './dashboard-table-dropdown.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTableDropdown {
  dropdown_ref = viewChild<UiDropdown>('dropdown');
  identifier = input<string>('');
  items = input<UiDropdownItem[][]>([]);
}
