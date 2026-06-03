import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { SaleService } from '../../services/sale.service';
import { SaleInterface } from '../../interfaces/sale.interface';
import { payment_methods_labeled } from '../../data/sale.data';

@Component({
    selector: 'sale-detail-drawer',
    imports: [DecimalPipe],
    templateUrl: './sale-detail-drawer.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleDetailDrawer {
    drawerService = inject(DrawerService);
    saleService = inject(SaleService);

    template_drawer = viewChild.required<TemplateRef<any>>('drawer_content');

    async open(sale: SaleInterface) {
        const full = await this.saleService.get_one(sale.id);
        this.saleService.selected_sale.set(full);

        this.drawerService.set_header({
            title: `Venta #${full.id}`,
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
            this.saleService.selected_sale.set(null);
            this.drawerService.set_content(null);
        });
    }

    payment_label(method: string): string {
        return payment_methods_labeled[method] ?? method;
    }
}
