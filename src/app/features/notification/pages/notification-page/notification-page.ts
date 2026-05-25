import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { menu_items } from '@/app/shared/data/menu';
import { ChangeDetectionStrategy, Component, computed, DOCUMENT, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { NotificationItem } from '../../components/notification-item/notification-item';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { NgClass } from '@angular/common';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';

@Component({
  selector: 'notification-page',
  imports: [NotificationItem, UiButton, NgClass, UiIcon],
  templateUrl: './notification-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'on_scroll()',
  },
})
export default class NotificationPage {
  notificationService = inject(NotificationService);
  dashboardService = inject(DashboardService);
  document = inject(DOCUMENT);

  constructor() {
    this.dashboardService.set_tree([menu_items.home, menu_items.notification]);
    this.dashboardService.set_reload(async () => await this.notificationService.refetch());
    this.notificationService.mark_all_as_read();
  }

  delete(id: number) {
    this.notificationService.delete(id);
  }

  can_load_more = computed(() => {
    const total = this.notificationService.notifications_result()?.total ?? 0;
    const loaded = this.notificationService.notifications_result()?.notifications.length ?? 0;

    return loaded < total;
  });

  on_scroll() {
    const doc = document.documentElement;
    const is_bottom = doc.scrollTop + doc.clientHeight >= doc.scrollHeight - 50;
    console.log('notification scroll');

    if (is_bottom && !this.notificationService.is_loading_more() && this.can_load_more()) {
      this.notificationService.load_more();
    }
  }
}
