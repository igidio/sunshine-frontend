import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { SaleInterface } from '../../interfaces/sale.interface';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { RouterLink } from '@angular/router';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'sale-get-bill',
  imports: [UiButton, RouterLink],
  templateUrl: './sale-get-bill.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleGetBill {
  sale = input.required<SaleInterface>();
  saleService = inject(SaleService);

  open_bill() {
    if (!this.sale()?.bill) return;
    this.saleService.open_bill(this.sale()!);
  }

}
