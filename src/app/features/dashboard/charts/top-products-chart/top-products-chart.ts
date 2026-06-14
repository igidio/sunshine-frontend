import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ChartsService } from '../../services/charts.service';
import type { TopProductChartsInterface } from '../../interfaces/charts.interface';

@Component({
  selector: 'top-products-chart',
  imports: [DecimalPipe],
  templateUrl: './top-products-chart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopProductsChart {
  chartsService = inject(ChartsService);

  products = computed<TopProductChartsInterface[]>(() =>
    this.chartsService.data()?.sales?.top_products ?? []
  );
}
