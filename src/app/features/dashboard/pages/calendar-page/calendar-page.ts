import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiBreadcrumb } from '@/app/shared/ui/ui-breadcrumb/ui-breadcrumb';

@Component({
  selector: 'calendar-page',
  imports: [UiBreadcrumb],
  templateUrl: './calendar-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CalendarPage {}
