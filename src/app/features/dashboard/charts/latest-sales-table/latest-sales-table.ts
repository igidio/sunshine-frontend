import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ChartsService } from '../../services/charts.service';
import { SalePaymentMethodBadge } from '../../../sale/components/sale-payment-method-badge/sale-payment-method-badge';

@Component({
    selector: 'latest-sales-table',
    imports: [DecimalPipe, DatePipe, SalePaymentMethodBadge],
    templateUrl: './latest-sales-table.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestSalesTable {
    chartsService = inject(ChartsService);

    latest = computed(() => this.chartsService.data()?.sales?.latest ?? []);
}
