import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { initDropdowns } from 'flowbite';
import { UiDropdownItem } from '../../data/ui-types';
import { UiBadge } from '../ui-badge/ui-badge';
import { UiIcon } from '../ui-icon/ui-icon';
import { RouterLink } from '@angular/router';

type UiDropdownPlacement =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end';

@Component({
  selector: 'ui-dropdown',
  imports: [UiBadge, UiIcon, RouterLink],
  templateUrl: './ui-dropdown.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDropdown {
  _id = input.required<string>();
  trigger = input<'hover' | 'click'>('click');
  delay = input(300);
  placement = input<UiDropdownPlacement | null>();
  distance = input<number | null>();
  skidding = input<number | null>();
  items = input<UiDropdownItem[][]>([]);

  ngAfterViewInit() {
    initDropdowns();
  }
}
