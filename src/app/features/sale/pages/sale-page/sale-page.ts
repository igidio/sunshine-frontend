import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { menu_items } from '@/app/shared/data/menu';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { ToastService } from '@/app/shared/services/toast.service';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiAlert } from '@/app/shared/ui/ui-alert/ui-alert';
import { SaleTable } from '../../components/sale-table/sale-table';
import { SaleCreate } from '../../components/sale-create/sale-create';
import { SaleResult } from "../../components/sale-result/sale-result";
import { SaleDetailDrawer } from "../../components/sale-detail-drawer/sale-detail-drawer";
import { SaleCreateService } from '../../services/sale-create.service';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'sale-page',
  templateUrl: './sale-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SaleCreate,
    SaleTable,
    UiCard,
    UiButton,
    SaleResult,
    SaleDetailDrawer,
    UiAlert,
  ],
})
export default class SalePage {
  dashboard = inject(DashboardService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);
  saleCreateService = inject(SaleCreateService);
  saleService = inject(SaleService);

  private query_param_map = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  active_view = computed(() => {
    const view = this.query_param_map().get('view');
    return view === 'create' ? 'create' : 'table';
  });

  set_view(view: 'create' | 'table') {
    if (view === this.active_view()) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view },
      replaceUrl: true,
    });
  }

  on_refresh_create = () => {
    if (this.active_view() === 'create') {
      this.saleCreateService.clear_customer();
    }
  }

  on_reload = async () => {
    await this.saleService.get();
    this.toastService.show({
      message: 'Lista de ventas actualizada',
      type: 'success',
    });
  };

  on_revert = () => {
    this.router.navigate([], {
      queryParams: {},
      replaceUrl: true,
    });

    this.toastService.show({
      message: 'Parámetros y filtros restablecidos',
      type: 'info',
    });
  };

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.sale]);
  }
}
