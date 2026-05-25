import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'movement-expandable',
  imports: [],
  templateUrl: './movement-expandable.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementExpandable {
  notes = input<string | null>(null);
  supplier = input<SupplierInterface | null>(null);
}
