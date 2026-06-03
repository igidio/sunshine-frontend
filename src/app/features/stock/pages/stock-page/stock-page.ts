import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { menu_items } from '@/app/shared/data/menu';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { StockTable } from '../../components/stock-table/stock-table';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { UiAlert } from '@/app/shared/ui/ui-alert/ui-alert';
import { MovementService } from '../../services/movement.service';
import { ToastService } from '@/app/shared/services/toast.service';

@Component({
  selector: 'app-stock-page',
  imports: [StockTable, UiCard, UiAlert],
  templateUrl: './stock-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StockPage implements OnInit, OnDestroy {
  dashboardService = inject(DashboardService);
  stockService = inject(MovementService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.stockService.listen_to_query_params(this.destroyRef);
  }

  constructor() {
    this.dashboardService.set_tree([menu_items.home, menu_items.stock]);
  }

  on_reload = async () => {
    this.stockService.reset();

    const data = await this.stockService.get(
      this.router.routerState.snapshot.root.queryParams as Record<string, string | number>,
    );
    this.stockService.movements.set(data);

    this.toastService.show({
      message: 'Lista de stock actualizada',
      type: 'success',
    });
  };

  on_revert = () => {
    this.router.navigate([], {
      queryParams: {},
      replaceUrl: true,
    });

    this.stockService.reset();

    this.toastService.show({
      message: 'Parámetros y filtros restablecidos',
      type: 'info',
    });
  };

  ngOnDestroy() {
    this.stockService.reset();
  }
}
