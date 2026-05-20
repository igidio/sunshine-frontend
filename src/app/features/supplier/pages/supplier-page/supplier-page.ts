import { ToastService } from '@/app/shared/services/toast.service';
import { menu_items } from '@/app/shared/data/menu';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { SseService } from '@/app/core/services/sse.service';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { SupplierTable } from '../../components/supplier-table/supplier-table';
import { SupplierService } from '../../services/supplier.service';
import { Router } from '@angular/router';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';

@Component({
  selector: 'supplier-page',
  imports: [UiCard, SupplierTable],
  templateUrl: './supplier-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SupplierPage implements OnInit, OnDestroy {
  supplierService = inject(SupplierService);
  private sseService = inject(SseService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  dashboard = inject(DashboardService);

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.supplier]);
  }

  event_callback() {
    console.log('Recargando la lista silenciosamente...');
  }

  ngOnInit() {
    this.sseService.add_event('new_notification', this.event_callback);
    this.supplierService.listen_to_query_params();
  }

  ngOnDestroy() {
    this.sseService.remove_event('new_notification', this.event_callback);
  }

  on_reload = async () => {
    await this.supplierService.get();
    this.toastService.show({
      message: 'Lista de proveedores actualizada',
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
