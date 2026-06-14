import { menu_items } from '@/app/shared/data/menu';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ChartsService } from '../../services/charts.service';
import { SalesTrendChart } from '../../charts/sales-trend-chart/sales-trend-chart';
import { SalesByPaymentMethod } from '../../charts/sales-by-payment-method/sales-by-payment-method';
import { TopProductsChart } from '../../charts/top-products-chart/top-products-chart';
import { TopTreatmentsChart } from '../../charts/top-treatments-chart/top-treatments-chart';
import { LatestSalesTable } from '../../charts/latest-sales-table/latest-sales-table';
import { WeekAppointmentsChart } from '../../charts/week-appointments-chart/week-appointments-chart';
import { LowStockProductsChart } from '../../charts/low-stock-products-chart/low-stock-products-chart';
import { ProductsByCategoryChart } from '../../charts/products-by-category-chart/products-by-category-chart';
import { AvgPriceByCategoryChart } from '../../charts/avg-price-by-category-chart/avg-price-by-category-chart';
import { MostPopularCategoriesChart } from '../../charts/most-popular-categories-chart/most-popular-categories-chart';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { UiStatCard } from "@/app/shared/ui/ui-stat-card/ui-stat-card";
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { UiBadge } from "@/app/shared/ui/ui-badge/ui-badge";

@Component({
  selector: 'main-page',
  imports: [
    SalesTrendChart,
    SalesByPaymentMethod,
    TopProductsChart,
    TopTreatmentsChart,
    LatestSalesTable,
    WeekAppointmentsChart,
    LowStockProductsChart,
    ProductsByCategoryChart,
    AvgPriceByCategoryChart,
    MostPopularCategoriesChart,
    UiCard,
    UiStatCard,
    DecimalPipe,
    UiBadge,
  ],
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

  customers = computed(() => this.chartsService.data()?.customers ?? null);
  catalog = computed(() => this.chartsService.data()?.catalog ?? null);
  bills = computed(() => this.chartsService.data()?.sales?.bills ?? null);
  inventory = computed(() => this.chartsService.data()?.inventory ?? null);
  sales = computed(() => this.chartsService.data()?.sales ?? null);

}
