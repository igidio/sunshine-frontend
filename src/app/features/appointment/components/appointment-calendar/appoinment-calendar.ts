import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CalendarComponent } from '@schedule-x/angular';
import {
  createCalendar,
  createViewWeek,
  createViewDay,
  createViewMonthGrid,
  createViewMonthAgenda,
} from '@schedule-x/calendar';
import 'temporal-polyfill/global';

@Component({
  selector: 'appointment-calendar',
  imports: [CalendarComponent],
  templateUrl: './appointment-calendar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentCalendar {
  calendar_app = createCalendar({
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: Temporal.Now.zonedDateTimeISO(),
        end: Temporal.Now.zonedDateTimeISO().add({ hours: 1 }),
      },
    ],
    locale: 'es-ES',
    callbacks: {
      fetchEvents: async () => {
        console.log('haciendo fetch');
        return [];
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
