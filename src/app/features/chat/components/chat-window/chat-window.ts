import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { ChatBubble } from '../chat-bubble/chat-bubble';
import { ChatService } from '../../services/chat.service';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';
import { ChatInput } from '../chat-input/chat-input';
import { ChatScroll } from '../chat-scroll/chat-scroll';
import { UiDropdown } from '@/app/shared/ui/ui-dropdown/ui-dropdown';
import { ChatDropdown } from '../chat-dropdown/chat-dropdown';

@Component({
  selector: 'chat-window',
  imports: [UiButton, ChatInput, ChatScroll, ChatDropdown],
  templateUrl: './chat-window.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWindow {
  chatService = inject(ChatService);

  chat_messages_container = viewChild<ElementRef>('chat_messages_container');
}
