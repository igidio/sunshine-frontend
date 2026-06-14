import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ChartsService } from '../../services/charts.service';
import type { LowStockChartsInterface } from '../../interfaces/charts.interface';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';
import type { UiBadgeVariants } from '@/app/shared/ui/ui-badge/ui-badge-variants';

@Component({
  selector: 'low-stock-products-chart',
  imports: [DecimalPipe, UiBadge],
  templateUrl: './low-stock-products-chart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LowStockProductsChart {
  chartsService = inject(ChartsService);

  products = computed<LowStockChartsInterface[]>(() =>
    this.chartsService.data()?.inventory?.low_stock ?? []
  );

  stockColor(qty: number): string {
    if (qty < 5) return 'text-danger';
    if (qty < 10) return 'text-fg-warning-subtle';
    return 'text-body';
  }

  stockVariant(qty: number): UiBadgeVariants {
    if (qty < 5) return 'danger';
    if (qty < 10) return 'warning';
    return 'brand';
  }
}
