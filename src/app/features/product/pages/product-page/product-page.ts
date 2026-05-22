import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { menu_items } from '@/app/shared/data/menu';
import { ToastService } from '@/app/shared/services/toast.service';
import { SseService } from '@/app/core/services/sse.service';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { ProductService } from '../../services/product.service';
import { ProductTable } from '../../components/product-table/product-table';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { CategoryService } from '../../services/category.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductDrawer } from '../../components/product-drawer/product-drawer';
import { CategoryTable } from '../../components/category-table/category-table';

@Component({
  selector: 'product-page',
  imports: [UiCard, ProductTable, UiButton, ProductDrawer, CategoryTable],
  templateUrl: './product-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductPage implements OnInit, OnDestroy {
  productService = inject(ProductService);
  private sseService = inject(SseService);
  private toastService = inject(ToastService);
  categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  dashboard = inject(DashboardService);

  private query_param_map = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  active_table = computed(() => {
    const table = this.query_param_map().get('table');
    return table === 'categories' ? 'categories' : 'products';
  });

  set_table(table: 'products' | 'categories') {
    if (table === this.active_table()) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { table },
      replaceUrl: true,
    });
  }

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.product]);
  }

  event_callback() {
    console.log('Recargando la lista silenciosamente...');
  }

  ngOnInit() {
    this.sseService.add_event('new_notification', this.event_callback);
    this.productService.listen_to_query_params();
    this.categoryService.listen_to_query_params();
  }

  ngOnDestroy() {
    this.sseService.remove_event('new_notification', this.event_callback);
  }

  on_reload = async () => {
    await this.productService.get();
    this.toastService.show({
      message: 'Lista de productos actualizada',
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
}
