import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { UiButton } from "@/app/shared/ui/ui-button/ui-button";
import { UiSelectMenu } from "@/app/shared/ui/ui-select-menu/ui-select-menu";
import { SaleCreateService } from '../../services/sale-create.service';
import { CustomerDrawer } from "@/app/features/customer/components/customer-drawer/customer-drawer";

@Component({
  selector: 'sale-field-client',
  imports: [UiButton, UiSelectMenu, CustomerDrawer],
  templateUrl: './sale-field-client.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleFieldClient {
  saleCreateService = inject(SaleCreateService);
  customer_drawer_ref = viewChild<CustomerDrawer>('customer_drawer');
}
