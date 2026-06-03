import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { SaleCreateService } from '../../services/sale-create.service';
import { SaleService } from '../../services/sale.service';
import { DecimalPipe } from '@angular/common';
import { UiButton } from "@/app/shared/ui/ui-button/ui-button";
import { UiSelect } from "@/app/shared/ui/ui-select/ui-select";
import { payment_methods, payment_methods_labeled } from '../../data/sale.data';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import type { SaleInterface } from '../../interfaces/sale.interface';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { ToastService } from '@/app/shared/services/toast.service';

@Component({
  selector: 'sale-result',
  imports: [DecimalPipe, UiButton, UiSelect, UiField],
  templateUrl: './sale-result.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleResult {
  saleCreateService = inject(SaleCreateService);
  toastService = inject(ToastService);
  saleService = inject(SaleService);
  created = output<SaleInterface>();

  payment_method_options = Object.entries(payment_methods_labeled).map(([value, label]) => ({
    value,
    label,
  }));

  async create() {
    const data = {
      customer_id: this.saleCreateService.customer()!.id,
      product_ids: this.saleCreateService.products().map((p) => p.id),
      appointments_ids: this.saleCreateService.appointments().map((a) => a.id),
      payment_method: this.saleCreateService.payment_method(),
    };
    const result = await this.saleService.create(data);
    this.created.emit(result);
    this.saleCreateService.clear_customer();;
    this.toastService.show({
      message: `La venta #${result.id} ha sido creada exitosamente.`,
      type: 'success',
    });
  }
}
