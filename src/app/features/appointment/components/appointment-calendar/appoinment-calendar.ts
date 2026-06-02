import {
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CalendarComponent } from '@schedule-x/angular';
import {
  createCalendar,
  createViewWeek,
  createViewDay,
  createViewMonthGrid,
  createViewMonthAgenda,
} from '@schedule-x/calendar';
import 'temporal-polyfill/global';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentDrawer } from '../appointment-drawer/appointment-drawer';
import { AppointmentInfo } from '../../appointment-info/appointment-info';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { ToastService } from '@/app/shared/services/toast.service';
import BreakpointHelper from '@/app/shared/helpers/breakpoint';
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createResizePlugin } from "@schedule-x/resize";


@Component({
  selector: 'appointment-calendar',
  imports: [CalendarComponent, AppointmentDrawer, AppointmentInfo],
  templateUrl: './appointment-calendar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentCalendar {
  appointmentService = inject(AppointmentService);
  drawerService = inject(DrawerService);
  toastService = inject(ToastService);
  template_drawer_info = viewChild.required<TemplateRef<any>>('drawer_info_content');
  appointment_info = viewChild<AppointmentInfo>('appointment_info');

  calendar_app = createCalendar(
    {
      timezone: Temporal.Now.timeZoneId(),
      locale: 'es-ES',
      callbacks: {
        onBeforeEventUpdateAsync: async (oldEvent, newEvent, $app) => {
          const start = newEvent.start as Temporal.ZonedDateTime;
          const end = newEvent.end as Temporal.ZonedDateTime;

          if (!this.appointmentService.validate_event_times(start, end)) {
            this.toastService.show({
              message: 'La hora de inicio debe ser anterior a la hora de fin',
              type: 'danger',
            });
            return false;
          }
          const appointment = this.appointmentService.appointments()?.data
            .find((a: any) => a.id.toString() === newEvent.id);

          if (!appointment) return false;

          this.appointmentService.selected_appointment.set(appointment);

          const start_date = start.toPlainDate().toString();
          const start_time = start.toPlainTime().toString().slice(0, 8);
          const end_time = end.toPlainTime().toString().slice(0, 8);
          try {
            await this.appointmentService.update({
              date: start_date,
              time: start_time,
              time_end: end_time,
              customer_id: appointment.customer_id,
              treatment_id: appointment.treatment_id,
              notes: appointment.notes,
            }, true);
            return true;
          } catch (error) {
            return false;
          }
        },
        fetchEvents: async (range) => {
          const start = range.start.toPlainDate().toString();
          const end = range.end.toPlainDate().toString();

          if (!this.appointmentService.appointments()?.data?.length) {
            await this.appointmentService.get({
              start,
              end,
            });
          }

          return this.appointmentService.mapped_items()
        },
        onEventClick: (calendar_event, event) => {
          this.appointmentService.selected_appointment.set(
            this.appointmentService
              .appointments()
              ?.data.find((appointment) => appointment.id.toString() === calendar_event.id) ??
            null,
          );

          const breakpoint = BreakpointHelper.get_breakpoint_value('lg');
          BreakpointHelper.compare_breakpoint(breakpoint!, async () => {
            this.open_drawer();
            return;
          });
        },
      },
      views: [
        createViewWeek(),
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
      ],

    },
    [
      this.appointmentService.event_service_plugin,
      createDragAndDropPlugin(),
      createCurrentTimePlugin(),
      //createResizePlugin(5),

    ],
  );

  open_drawer = () => {
    this.drawerService.set_header({
      title: 'Información de la cita',
      show_close_button: true,
      show_divider: true,
    });
    this.drawerService.set_content(this.template_drawer_info());
    this.drawerService.set_footer([
      {
        label: 'Cerrar',
        variant: 'secondary',
        size: 'md',
        action: () => this.drawerService.close(),
      },
    ]);
    this.drawerService.open();
  };
}
function createCalendarControlsPlugin() {
  throw new Error('Function not implemented.');
}
