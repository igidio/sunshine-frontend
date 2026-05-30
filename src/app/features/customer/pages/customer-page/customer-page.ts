import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { menu_items } from '@/app/shared/data/menu';
import { ToastService } from '@/app/shared/services/toast.service';
import { SseService } from '@/app/core/services/sse.service';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { CustomerTable } from '../../components/customer-table/customer-table';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';

@Component({
  selector: 'customer-page',
  imports: [UiCard, CustomerTable],
  templateUrl: './customer-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CustomerPage implements OnInit, OnDestroy {
  customerService = inject(CustomerService);
  private sseService = inject(SseService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  dashboard = inject(DashboardService);
  destroyRef = inject(DestroyRef);

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.customer]);
  }

  event_callback() {
    console.log('Recargando la lista silenciosamente...');
  }

  ngOnInit() {
    this.sseService.add_event('new_notification', this.event_callback);
    this.customerService.listen_to_query_params(this.destroyRef);
  }

  ngOnDestroy() {
    this.sseService.remove_event('new_notification', this.event_callback);
  }

  on_reload = async () => {
    await this.customerService.get();
    this.toastService.show({
      message: 'Lista de clientes actualizada',
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
