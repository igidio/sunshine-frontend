import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiSelectMenu } from '@/app/shared/ui/ui-select-menu/ui-select-menu';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SaleCreateService } from '../../services/sale-create.service';

@Component({
  selector: 'sale-field-product',
  imports: [UiButton, UiSelectMenu],
  templateUrl: './sale-field-product.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleFieldProduct {
  saleCreateService = inject(SaleCreateService);
}
