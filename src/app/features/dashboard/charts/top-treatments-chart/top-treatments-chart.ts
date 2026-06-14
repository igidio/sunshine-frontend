import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ChartsService } from '../../services/charts.service';
import type { TopTreatmentChartsInterface } from '../../interfaces/charts.interface';

@Component({
  selector: 'top-treatments-chart',
  imports: [DecimalPipe],
  templateUrl: './top-treatments-chart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopTreatmentsChart {
  chartsService = inject(ChartsService);

  treatments = computed<TopTreatmentChartsInterface[]>(() =>
    this.chartsService.data()?.sales?.top_treatments ?? []
  );
}
