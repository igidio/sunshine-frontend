import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { ChatBubble } from '../chat-bubble/chat-bubble';
import { ChatService } from '../../services/chat.service';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { ChatInput } from '../chat-bubble/chat-input/chat-input';

@Component({
  selector: 'chat-window',
  imports: [UiButton, ChatBubble, UiIcon, UiInput, ChatInput],
  templateUrl: './chat-window.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWindow implements AfterViewChecked {
  chatService = inject(ChatService);

  chat_messages_container = viewChild<ElementRef>('chat_messages_container');

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
