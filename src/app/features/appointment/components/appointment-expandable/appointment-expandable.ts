import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'appointment-expandable',
  imports: [],
  templateUrl: './appointment-expandable.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentExpandable {
  notes = input<string | null>(null);
}
