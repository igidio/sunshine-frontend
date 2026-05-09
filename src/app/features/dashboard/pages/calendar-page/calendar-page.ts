import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { UiBreadcrumb } from '@/app/shared/ui/ui-breadcrumb/ui-breadcrumb';
import { DashboardService } from '../../services/dashboard.service';
import { menu_items } from '@/app/shared/data/menu';

@Component({
  selector: 'calendar-page',
  templateUrl: './calendar-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CalendarPage {
  dashboard = inject(DashboardService);

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.calendar]);
  }

  ngAfterViewInit(): void {
    this.dashboard.set_tree([menu_items.home, menu_items.calendar]);
  }
}
