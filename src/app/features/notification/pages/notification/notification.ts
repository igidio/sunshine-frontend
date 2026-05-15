import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'notification-page',
  imports: [],
  templateUrl: './notification.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotificationPage {}
