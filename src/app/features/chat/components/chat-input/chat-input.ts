import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { ChatService } from '../../services/chat.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'chat-input',
  imports: [UiButton, NgClass],
  templateUrl: './chat-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatInput {
  chatService = inject(ChatService);
  chat_input = viewChild<ElementRef<HTMLInputElement>>('message_input');

  send_message() {
    const input = this.chat_input()?.nativeElement;
    if (!input?.value?.trim()) return;
    input.blur();
    this.chatService.send_message(input?.value);
    input.value = '';
  }
}
