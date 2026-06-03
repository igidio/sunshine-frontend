import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SaleCreateService } from '../../services/sale-create.service';
import { DecimalPipe } from '@angular/common';
import { UiButton } from "@/app/shared/ui/ui-button/ui-button";
import { UiSelect } from "@/app/shared/ui/ui-select/ui-select";
import { payment_methods, payment_methods_labeled } from '../../data/sale.data';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';

@Component({
  selector: 'sale-result',
  imports: [DecimalPipe, UiButton, UiSelect, UiField],
  templateUrl: './sale-result.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleResult {
  saleCreateService = inject(SaleCreateService);

  payment_method_options = Object.entries(payment_methods_labeled).map(([value, label]) => ({
    value,
    label,
  }));

}
