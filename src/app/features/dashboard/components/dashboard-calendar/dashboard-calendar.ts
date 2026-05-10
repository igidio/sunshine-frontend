import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarComponent } from '@schedule-x/angular';
import { createCalendar, createViewWeek } from '@schedule-x/calendar';
import 'temporal-polyfill/global';

@Component({
  selector: 'dashboard-calendar',
  imports: [CalendarComponent],
  templateUrl: './dashboard-calendar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardCalendar {
  calendar_app = createCalendar({
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: Temporal.Now.zonedDateTimeISO(),
        end: Temporal.Now.zonedDateTimeISO().add({ hours: 1 }),
      },
    ],
    views: [createViewWeek()],
  });
}
