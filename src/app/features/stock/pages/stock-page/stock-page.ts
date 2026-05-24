import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { menu_items } from '@/app/shared/data/menu';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-stock-page',
  imports: [],
  templateUrl: './stock-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StockPage {
  dashboardService = inject(DashboardService);

  constructor() {
    this.dashboardService.set_tree([menu_items.home, menu_items.stock]);
  }
}
