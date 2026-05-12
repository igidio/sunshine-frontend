import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';

@Component({
  selector: 'chat-window',
  imports: [UiButton],
  templateUrl: './chat-window.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWindow {}
