import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { menu_items } from '@/app/shared/data/menu';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { NotificationItem } from '../../components/notification-item/notification-item';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'notification-page',
  imports: [NotificationItem, UiButton, NgClass],
  templateUrl: './notification-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotificationPage {
  notificationService = inject(NotificationService);
  dashboardService = inject(DashboardService);

  constructor() {
    this.dashboardService.set_tree([menu_items.home, menu_items.notification]);
    this.dashboardService.set_reload(async () => await this.notificationService.refetch());
  }

  delete(id: number) {
    this.notificationService.delete(id);
    console.log('delete ' + id);
  }
}
