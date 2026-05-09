import { menu_items } from '@/app/shared/data/menu';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'main-page',
  imports: [],
  templateUrl: './main-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainPage {
  dashboard = inject(DashboardService);

  constructor() {
    this.dashboard.set_tree([menu_items.home]);
  }
}
