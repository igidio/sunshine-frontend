import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { menu_items } from '@/app/shared/data/menu';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { NotificationItem } from '../../components/notification-item/notification-item';

@Component({
  selector: 'notification-page',
  imports: [NotificationItem],
  templateUrl: './notification-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotificationPage {
  notificationService = inject(NotificationService);
  dashboard = inject(DashboardService);

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.notification]);
    this.dashboard.set_reload(() => console.log('holaa'));
  }

  delete(id: number) {
    this.notificationService.delete(id);
    console.log('delete ' + id);
  }
}
