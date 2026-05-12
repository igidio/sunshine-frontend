import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'chat-input',
  imports: [UiButton],
  templateUrl: './chat-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatInput {
  chatService = inject(ChatService);
  chat_input = viewChild<ElementRef<HTMLInputElement>>('message_input');

  send_message() {
    const input = this.chat_input()?.nativeElement;
    if (!input?.value?.trim()) return;
    this.chatService.send_message(input?.value);
    input.value = '';
    //this.scroll_to_bottom();
  }
}
