import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { menu_items } from '@/app/shared/data/menu';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { JsonPipe } from '@angular/common';
import { TimeAgoPipe } from '@/app/core/pipes/time_ago.pipe';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';
import { IconValue } from '@/app/shared/data/icons';
import { RouterLink } from '@angular/router';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';

@Component({
  selector: 'notification-page',
  imports: [TimeAgoPipe, RouterLink, UiIcon, UiButton],
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

  get types(): Record<
    string,
    { type: string; icon: IconValue; background?: string; foreground?: string; border?: string }
  > {
    return {
      success: {
        type: 'success',
        icon: 'success',
        background: 'bg-success-soft',
        foreground: 'text-success-strong',
        border: 'border-success border',
      },
      danger: {
        type: 'danger',
        icon: 'danger',
        background: 'bg-danger-soft',
        foreground: 'text-danger-strong',
        border: 'border-danger border',
      },
      info: {
        type: 'info',
        icon: 'info',
        background: 'bg-brand-soft',
        foreground: 'text-fg-brand-strong',
        border: 'border-brand border',
      },
      warning: {
        type: 'warning',
        icon: 'warning',
        background: 'bg-warning-soft',
        foreground: 'text-warning-strong',
        border: 'border-warning border',
      },
    };
  }
}
