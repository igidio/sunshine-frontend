import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconValue } from '../../data/icons';
import { UiIcon } from '../ui-icon/ui-icon';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { menuItemInterface } from '../../data/menu';

interface BreadcrumbItem extends menuItemInterface {}

@Component({
  selector: 'ui-breadcrumb',
  imports: [UiIcon, RouterLink, NgClass],
  templateUrl: './ui-breadcrumb.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBreadcrumb {
  items = input.required<BreadcrumbItem[]>();
}
