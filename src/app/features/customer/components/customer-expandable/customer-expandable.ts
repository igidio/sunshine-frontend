import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'customer-expandable',
  imports: [],
  templateUrl: './customer-expandable.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerExpandable {
  address = input<string | null | undefined>();
}
