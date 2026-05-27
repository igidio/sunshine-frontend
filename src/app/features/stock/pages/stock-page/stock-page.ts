import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { menu_items } from '@/app/shared/data/menu';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { StockTable } from '../../components/stock-table/stock-table';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { MovementService } from '../../services/movement.service';

@Component({
  selector: 'app-stock-page',
  imports: [StockTable, UiCard],
  templateUrl: './stock-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StockPage implements OnInit, OnDestroy {
  dashboardService = inject(DashboardService);
  stockService = inject(MovementService);

  ngOnInit() {
    this.stockService.listen_to_query_params();
  }

  constructor() {
    this.dashboardService.set_tree([menu_items.home, menu_items.stock]);
  }

  ngOnDestroy() {
    this.stockService.reset();
  }
}
