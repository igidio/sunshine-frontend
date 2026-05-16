import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationDropdown } from '../notification-dropdown/notification-dropdown';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import BreakpointHelper from '@/app/shared/helpers/breakpoint';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'notification-button',
  imports: [NotificationDropdown, UiButton],
  templateUrl: './notification-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationButton {
  router = inject(Router);
  notificationService = inject(NotificationService);

  open_notifications() {
    const breakpoint = BreakpointHelper.get_breakpoint_value('sm');
    BreakpointHelper.compare_breakpoint(breakpoint!, async () => {
      await this.router.navigate(['/dashboard/notification']);
      return;
    });

    // open notifications menu
  }
}
