import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconValue } from '../../data/icons';
import { UiIcon } from '../ui-icon/ui-icon';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

interface BreadcrumbItem {
  label: string;
  route: string;
  icon?: IconValue;
}

@Component({
  selector: 'ui-breadcrumb',
  imports: [UiIcon, RouterLink, NgClass],
  templateUrl: './ui-breadcrumb.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBreadcrumb {
  items: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/dashboard', icon: 'home' },
    { label: 'Calendario', route: '/dashboard/calendar', icon: 'calendar' },
  ];
}
