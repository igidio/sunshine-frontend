import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SaleCreateService } from '../../services/sale-create.service';
import { DecimalPipe } from '@angular/common';
import { UiButton } from "@/app/shared/ui/ui-button/ui-button";
import { UiInput } from "@/app/shared/ui/ui-input/ui-input";
import { UiField } from "@/app/shared/ui/ui-field/ui-field";
import { form, max, min, pattern } from '@angular/forms/signals';

@Component({
  selector: 'sale-result',
  imports: [DecimalPipe, UiButton],
  templateUrl: './sale-result.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleResult {
  saleCreateService = inject(SaleCreateService);

}
