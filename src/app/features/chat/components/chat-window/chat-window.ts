import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { ChatService } from '../../services/chat.service';
import { ChatInput } from '../chat-input/chat-input';
import { ChatScroll } from '../chat-scroll/chat-scroll';
import { ChatDropdown } from '../chat-dropdown/chat-dropdown';

@Component({
  selector: 'chat-window',
  imports: [UiButton, ChatInput, ChatScroll, ChatDropdown],
  templateUrl: './chat-window.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWindow {
  chatService = inject(ChatService);
}
