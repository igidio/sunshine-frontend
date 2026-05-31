import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'treatment-expandable',
  imports: [],
  templateUrl: './treatment-expandable.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreatmentExpandable {
  description = input<string | null | undefined>();
}
