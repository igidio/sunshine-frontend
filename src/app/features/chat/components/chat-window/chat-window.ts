import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { ChatBubble } from '../chat-bubble/chat-bubble';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'chat-window',
  imports: [UiButton, ChatBubble],
  templateUrl: './chat-window.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWindow implements AfterViewChecked {
  chatService = inject(ChatService);

  chat_messages_container = viewChild<ElementRef>('chat_messages_container');
  chat_input = viewChild<ElementRef<HTMLInputElement>>('message_input');

  scroll_to_bottom() {
    const container = this.chat_messages_container()?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  send_message() {
    const input = this.chat_input()?.nativeElement;
    if (!input?.value?.trim()) return;
    this.chatService.send_message(input?.value);
    input.value = '';
    this.scroll_to_bottom();
  }

  ngAfterViewChecked() {
    this.scroll_to_bottom();
  }
}
