import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NotificationInterface } from '../../notification.interface';
import { RouterLink } from '@angular/router';
import { TimeAgoPipe } from '@/app/core/pipes/time_ago.pipe';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';
import { IconValue } from '@/app/shared/data/icons';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';

@Component({
  selector: 'notification-item',
  imports: [RouterLink, TimeAgoPipe, UiIcon, UiButton],
  templateUrl: './notification-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationItem {
  notification = input.required<NotificationInterface>();
  delete = output<number>();

  delete_notification() {
    this.delete.emit(this.notification().id);
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
