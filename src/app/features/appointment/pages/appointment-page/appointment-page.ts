import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { UiBreadcrumb } from '@/app/shared/ui/ui-breadcrumb/ui-breadcrumb';
import { menu_items } from '@/app/shared/data/menu';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { AppointmentCalendar } from '../../components/appointment-calendar/appoinment-calendar';

@Component({
  selector: 'appointment-page',
  templateUrl: './appointment-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppointmentCalendar],
})
export default class CalendarPage {
  dashboard = inject(DashboardService);

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.appointment]);
  }
}
