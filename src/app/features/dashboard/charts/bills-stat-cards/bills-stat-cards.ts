import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ChartsService } from '../../services/charts.service';
import { UiStatCard } from '@/app/shared/ui/ui-stat-card/ui-stat-card';

@Component({
  selector: 'bills-stat-cards',
  imports: [DecimalPipe, UiStatCard],
  templateUrl: './bills-stat-cards.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillsStatCards {
  chartsService = inject(ChartsService);

  bills = computed(() => this.chartsService.data()?.sales?.bills ?? null);
}
