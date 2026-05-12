import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiTooltip } from '@/app/shared/ui/ui-tooltip/ui-tooltip';
import { ChatService } from '../../services/chat.service';
import BreakpointHelper from '@/app/shared/helpers/breakpoint';

@Component({
  selector: 'chat-button',
  imports: [UiButton, UiTooltip],
  templateUrl: './chat-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatButton {
  chatService = inject(ChatService);
  router = inject(Router);

  toggle_chat_window() {
    const breakpoint = BreakpointHelper.get_breakpoint_value('sm');
    BreakpointHelper.compare_breakpoint(breakpoint!, async () => {
      this.router.navigate(['/dashboard/chat']);
      return;
    });

    this.chatService.toggle_chat_window();
  }
}
