import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { menu_items } from '@/app/shared/data/menu';
import { ToastService } from '@/app/shared/services/toast.service';
import { SseService } from '@/app/core/services/sse.service';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { ProductService } from '../../services/product.service';
import { ProductTable } from '../../components/product-table/product-table';

@Component({
  selector: 'product-page',
  imports: [UiCard, ProductTable],
  templateUrl: './product-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductPage implements OnInit, OnDestroy {
  productService = inject(ProductService);
  private sseService = inject(SseService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  dashboard = inject(DashboardService);

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.product]);
  }

  event_callback() {
    console.log('Recargando la lista silenciosamente...');
  }

  ngOnInit() {
    this.sseService.add_event('new_notification', this.event_callback);
    this.productService.listen_to_query_params();
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
