import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
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
import BreakpointHelper from '@/app/shared/helpers/breakpoint';
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'appointment-calendar',
  imports: [CalendarComponent, AppointmentDrawer, AppointmentInfo, JsonPipe],
  templateUrl: './appointment-calendar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentCalendar {
  appointmentService = inject(AppointmentService);
  drawerService = inject(DrawerService);
  template_drawer_info = viewChild.required<TemplateRef<any>>('drawer_info_content');
  appointment_info = viewChild<AppointmentInfo>('appointment_info');

  calendar_app = createCalendar(
    {
      timezone: Temporal.Now.timeZoneId(),
      locale: 'es-ES',
      callbacks: {
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
    [this.appointmentService.event_service_plugin, createCurrentTimePlugin()
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
