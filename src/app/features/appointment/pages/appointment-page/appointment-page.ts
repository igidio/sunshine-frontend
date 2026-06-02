import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { menu_items } from '@/app/shared/data/menu';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { AppointmentCalendar } from '../../components/appointment-calendar/appoinment-calendar';
import { AppointmentTable } from '../../components/appointment-table/appointment-table';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { AppointmentService } from '../../services/appointment.service';
import { ToastService } from '@/app/shared/services/toast.service';
import { AppointmentInfo } from '../../appointment-info/appointment-info';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';
import { UiButton } from "@/app/shared/ui/ui-button/ui-button";
import { AppointmentDrawer } from '../../components/appointment-drawer/appointment-drawer';

@Component({
  selector: 'appointment-page',
  templateUrl: './appointment-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppointmentCalendar,
    AppointmentTable,
    UiCard,
    AppointmentInfo,
    UiIcon,
    UiButton,
    AppointmentDrawer,
  ],
})
export default class CalendarPage {
  dashboard = inject(DashboardService);
  appointmentService = inject(AppointmentService);
  toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  appointment_drawer_ref = viewChild<AppointmentDrawer>('appointment_drawer');

  private query_param_map = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  active_table = computed(() => {
    const table = this.query_param_map().get('table');
    return table === 'table' ? 'table' : 'calendar';
  });

  set_table(table: 'calendar' | 'table') {
    if (table === this.active_table()) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { table },
      replaceUrl: true,
    });
  }

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
