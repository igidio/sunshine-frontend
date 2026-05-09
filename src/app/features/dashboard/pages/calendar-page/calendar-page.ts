import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'calendar-page',
  imports: [],
  templateUrl: './calendar-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CalendarPage {}
