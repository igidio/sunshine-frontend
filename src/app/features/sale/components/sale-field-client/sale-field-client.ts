import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { UiButton } from "@/app/shared/ui/ui-button/ui-button";
import { UiSelectMenu } from "@/app/shared/ui/ui-select-menu/ui-select-menu";
import { SaleCreateService } from '../../services/sale-create.service';

@Component({
  selector: 'sale-field-client',
  imports: [UiButton, UiSelectMenu],
  templateUrl: './sale-field-client.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleFieldClient {
  saleCreateService = inject(SaleCreateService);
}
