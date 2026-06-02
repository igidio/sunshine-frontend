import { AfterViewInit, ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { menu_items } from '@/app/shared/data/menu';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { AppointmentCalendar } from '../../components/appointment-calendar/appoinment-calendar';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { AppointmentService } from '../../services/appointment.service';
import { ToastService } from '@/app/shared/services/toast.service';
import { DatePipe } from '@angular/common';
import { AppointmentInfo } from '../../appointment-info/appointment-info';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';
import { UiButton } from "@/app/shared/ui/ui-button/ui-button";
import { AppointmentDrawer } from '../../components/appointment-drawer/appointment-drawer';

@Component({
  selector: 'appointment-page',
  templateUrl: './appointment-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppointmentCalendar, UiCard, AppointmentInfo, UiIcon, UiButton, AppointmentDrawer],
})
export default class CalendarPage {
  dashboard = inject(DashboardService);
  appointmentService = inject(AppointmentService);
  toastService = inject(ToastService);

  appointment_drawer_ref = viewChild<AppointmentDrawer>('appointment_drawer');

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.appointment]);
  }

  on_reload = async () => {
    await this.appointmentService.get();
    this.toastService.show({
      message: 'Agenda de citas actualizada',
      type: 'success',
    });
  };

  on_revert = () => {
    this.appointmentService.selected_appointment.set(null);
    this.appointmentService.appointments.set(undefined);
    this.toastService.show({
      message: 'Parámetros y filtros restablecidos',
      type: 'info',
    });
  };
}
