import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { ChatService } from '@/app/features/chat/services/chat.service';
import { ChatBubble } from '@/app/features/chat/components/chat-bubble/chat-bubble';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';

@Component({
  selector: 'app-chat-page',
  imports: [UiButton, ChatBubble, UiIcon],
  templateUrl: './chat-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChatPage implements AfterViewChecked {
  chatService = inject(ChatService);

  chat_messages_container = viewChild<ElementRef>('chat_messages_container');
  chat_input = viewChild<ElementRef<HTMLInputElement>>('message_input');
  menu_items: any;

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
