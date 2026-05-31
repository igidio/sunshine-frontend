import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

@Component({
  selector: 'appointment-calendar',
  imports: [CalendarComponent],
  templateUrl: './appointment-calendar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentCalendar {
  appointmentService = inject(AppointmentService);
  calendar_app = createCalendar({
    events: [],
    locale: 'es-ES',
    callbacks: {
      fetchEvents: async (range) => {
        const start = range.start.toPlainDate().toString();
        const end = range.end.toPlainDate().toString();

        await this.appointmentService.get({
          start,
          end,
        });
        return this.appointmentService.mapped_items();
      },
      onEventClick: (calendar_event, event) => {
        this.appointmentService.selected_appointment.set(
          this.appointmentService
            .appointments()
            ?.data.find((appointment) => appointment.id.toString() === calendar_event.id) ?? null,
        );
      },
    },
    views: [
      createViewWeek(),
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
  });
}
