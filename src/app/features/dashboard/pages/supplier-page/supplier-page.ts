import { menu_items } from '@/app/shared/data/menu';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { SseService } from '@/app/core/services/sse.service';

@Component({
  selector: 'supplier-page',
  imports: [],
  templateUrl: './supplier-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SupplierPage implements OnInit, OnDestroy {
  private sseService = inject(SseService);
  dashboard = inject(DashboardService);

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.supplier]);
  }

  event_callback() {
    console.log('Recargando la lista silenciosamente...');
  }

  ngOnInit() {
    this.sseService.add_event('new_notification', this.event_callback);
  }

  ngOnDestroy() {
    this.sseService.remove_event('new_notification', this.event_callback);
  }
}
