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
  selector: 'inventory-stats',
  imports: [DecimalPipe, UiStatCard],
  templateUrl: './inventory-stats.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryStats {
  chartsService = inject(ChartsService);

  inventory = computed(() => this.chartsService.data()?.inventory ?? null);
}
