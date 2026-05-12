import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  http_client = inject(HttpClient);
  show_chat_window = signal<boolean>(false);
  assistant_typing = signal<boolean>(false);
  streamed_message = signal<string | null>(null);
  last_message = signal<{ content: string; has_failed: boolean } | null>(null);
  chat_messages = signal<{ role: 'user' | 'assistant'; content: string }[]>([]);
  scroll_element = signal<HTMLElement | null>(null);

  toggle_chat_window(state?: boolean) {
    this.show_chat_window.update((current) => state ?? !current);
  }

  scroll_to_bottom() {
    const container = this.scroll_element();
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  private async stream_reply(reply: string) {
    this.streamed_message.set('');

    for (const char of reply) {
      this.streamed_message.update((current) => current + char);
      this.scroll_to_bottom();
      await new Promise((resolve) => setTimeout(resolve, 15));
    }
  }

  send_message(message: string) {
    this.last_message.set({ content: message, has_failed: false });

    this.assistant_typing.set(true);

    const to_send = this.chat_messages().concat([{ role: 'user', content: message }]);

    return this.http_client
      .post<{ reply: string }>('/api/chat', to_send, {})
      .pipe(
        catchError((error) => {
          this.last_message.set({ content: message, has_failed: true });
          this.assistant_typing.set(false);
          throw error;
        }),
        finalize(() => {
          this.assistant_typing.set(false);
        }),
      )
      .subscribe(async (response) => {
        this.streamed_message.set(null);
        await this.stream_reply(response.reply);
        this.streamed_message.set(null);
        this.last_message.set(null);
        this.chat_messages.update((current) => [
          ...current,
          { role: 'user', content: message },
          { role: 'assistant', content: response.reply },
        ]);
        localStorage.setItem('chat_messages', JSON.stringify(this.chat_messages()));
      });
  }

  get_messages() {
    const messages_from_local_storage = localStorage.getItem('chat_messages');
    this.chat_messages.update((current) =>
      messages_from_local_storage ? JSON.parse(messages_from_local_storage) : [],
    );
  }

  delete_messages() {
    this.chat_messages.set([]);
    localStorage.removeItem('chat_messages');
    this.last_message.set(null);
  }

  private check_and_format_messages(messages: { role: 'user' | 'assistant'; content: string }[]) {
    let valid_messages =
      messages.length > 20 ? messages.slice(messages.length - 20) : [...messages];

    while (valid_messages.length > 0 && valid_messages[0].role !== 'assistant') {
      valid_messages.shift();
    }

    while (
      valid_messages.length > 0 &&
      valid_messages[valid_messages.length - 1].role !== 'assistant'
    ) {
      valid_messages.pop();
    }

    localStorage.setItem('chat_messages', JSON.stringify(valid_messages));
  }

  constructor() {
    this.check_and_format_messages(
      localStorage.getItem('chat_messages')
        ? JSON.parse(localStorage.getItem('chat_messages')!)
        : [],
    );
    this.get_messages();
  }
}
