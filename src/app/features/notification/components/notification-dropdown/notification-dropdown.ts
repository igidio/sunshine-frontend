import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { UiDropdown } from '@/app/shared/ui/ui-dropdown/ui-dropdown';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { NotificationService } from '../../services/notification.service';
import { NotificationItem } from '../notification-item/notification-item';
import { Router, RouterLink } from '@angular/router';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';

@Component({
  selector: 'notification-dropdown',
  imports: [UiDropdown, UiButton, NotificationItem, UiIcon, RouterLink],
  templateUrl: './notification-dropdown.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationDropdown {
  router = inject(Router);
  notificationService = inject(NotificationService);
  dropdown_ref = viewChild<UiDropdown>('dropdown');
}
