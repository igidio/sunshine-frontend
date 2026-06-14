import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiIcon } from "@/app/shared/ui/ui-icon/ui-icon";

@Component({
  selector: 'product-item',
  imports: [UiIcon],
  templateUrl: './product-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItem { }
