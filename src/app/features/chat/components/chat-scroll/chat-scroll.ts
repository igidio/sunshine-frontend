import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatBubble } from '../chat-bubble/chat-bubble';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { NgClass } from '@angular/common';
import { ChatStreamed } from "../chat-streamed/chat-streamed";

@Component({
  selector: 'chat-scroll',
  imports: [ChatBubble, UiIcon, UiButton, ChatStreamed],
  templateUrl: './chat-scroll.html',
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatScroll {
  chatService = inject(ChatService);
  chat_messages_container = viewChild<ElementRef>('chat_messages_container');

  scroll_to_bottom() {
    const container = this.chat_messages_container()?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  ngAfterViewChecked() {
    this.chatService.scroll_element.set(this.chat_messages_container()?.nativeElement ?? null);
    this.chatService.scroll_to_bottom();
  }
}
