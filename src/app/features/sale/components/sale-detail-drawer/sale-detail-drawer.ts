import { ChangeDetectionStrategy, Component, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { SaleService } from '../../services/sale.service';
import { SaleInterface } from '../../interfaces/sale.interface';
import { SalePaymentMethodBadge } from '../sale-payment-method-badge/sale-payment-method-badge';
import { SaleGetBill } from "../sale-get-bill/sale-get-bill";

@Component({
  selector: 'sale-detail-drawer',
  imports: [DecimalPipe, SalePaymentMethodBadge, SaleGetBill],
  templateUrl: './sale-detail-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleDetailDrawer {
  drawerService = inject(DrawerService);
  saleService = inject(SaleService);

  selected_sale = signal<SaleInterface | null>(null);

  template_drawer = viewChild.required<TemplateRef<any>>('drawer_content');

  async open(sale: SaleInterface) {
    this.selected_sale.set(sale);

    this.drawerService.set_header({
      title: `Detalles de venta`,
      show_close_button: true,
      show_divider: true,
    });

    this.drawerService.set_content(this.template_drawer());

    this.drawerService.set_footer([
      {
        label: 'Cerrar',
        variant: 'secondary',
        size: 'sm',
        action: () => this.drawerService.close(),
      },
    ]);

    this.drawerService.open();

    this.drawerService.set_on_close(() => {
      this.selected_sale.set(null);
      this.drawerService.set_content(null);
    });
  }
}
