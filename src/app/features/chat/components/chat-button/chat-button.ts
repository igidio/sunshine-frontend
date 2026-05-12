import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiTooltip } from '@/app/shared/ui/ui-tooltip/ui-tooltip';

@Component({
  selector: 'chat-button',
  imports: [UiButton, UiTooltip],
  templateUrl: './chat-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatButton {}
