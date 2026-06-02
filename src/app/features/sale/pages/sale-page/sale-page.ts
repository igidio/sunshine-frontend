import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { menu_items } from '@/app/shared/data/menu';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { SaleTable } from '../../components/sale-table/sale-table';
import { SaleCreate } from '../../components/sale-create/sale-create';

@Component({
  selector: 'sale-page',
  templateUrl: './sale-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SaleCreate,
    SaleTable,
    UiCard,
    UiButton,
  ],
})
export default class SalePage {
  dashboard = inject(DashboardService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

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

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.sale]);
  }
}
