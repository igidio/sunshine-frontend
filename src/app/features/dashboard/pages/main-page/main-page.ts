import { menu_items } from '@/app/shared/data/menu';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ChartsService } from '../../services/charts.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'main-page',
  imports: [JsonPipe],
  templateUrl: './main-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainPage implements OnInit {
  dashboard = inject(DashboardService);
  chartsService = inject(ChartsService);

  constructor() {
    this.dashboard.set_tree([menu_items.home]);
  }

  ngOnInit() {
    this.chartsService.get_data();
  }
}
