import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { ChatService } from '@/app/features/chat/services/chat.service';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';
import { ChatInput } from '@/app/features/chat/components/chat-input/chat-input';
import { ChatScroll } from '@/app/features/chat/components/chat-scroll/chat-scroll';

@Component({
  selector: 'app-chat-page',
  imports: [UiIcon, ChatInput, ChatScroll],
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

  ngAfterViewChecked() {
    this.scroll_to_bottom();
  }
}
