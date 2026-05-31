import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { menu_items } from '@/app/shared/data/menu';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { AppointmentCalendar } from '../../components/appointment-calendar/appoinment-calendar';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { AppointmentService } from '../../services/appointment.service';
import { DatePipe } from '@angular/common';
import { AppointmentInfo } from '../../appointment-info/appointment-info';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';

@Component({
  selector: 'appointment-page',
  templateUrl: './appointment-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppointmentCalendar, UiCard, AppointmentInfo, UiIcon],
})
export default class CalendarPage {
  dashboard = inject(DashboardService);
  appointmentService = inject(AppointmentService);

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.appointment]);
  }
}
