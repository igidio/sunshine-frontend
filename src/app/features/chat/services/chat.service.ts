import { inject, Injectable, signal } from '@angular/core';
import { StreamChunk } from '../interfaces/chat.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  show_chat_window = signal<boolean>(false);
  last_message = signal<{ content: string; has_failed: boolean } | null>(null);
  chat_messages = signal<{ role: 'user' | 'assistant'; content: string }[]>([]);
  scroll_element = signal<HTMLElement | null>(null);

  assistant_typing = signal<boolean>(false);
  streamed_message = signal<string | null>(null);
  generated_chunks = signal<StreamChunk[]>([]);

  toggle_chat_window(state?: boolean) {
    this.show_chat_window.update((current) => state ?? !current);
    if (this.show_chat_window()) {
      this.receive_first_message();
    }
  }

  scroll_to_bottom() {
    const container = this.scroll_element();
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  async send_message(message: string) {
    this.last_message.set({ content: message, has_failed: false });
    this.assistant_typing.set(true);
    this.streamed_message.set('');
    this.generated_chunks.set([]);

    const to_send = this.chat_messages().concat([{ role: 'user', content: message }]);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(to_send),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        const parsed_chunks = this.parse_stream_chunk(chunk);
        if (parsed_chunks.length > 0) {
          this.generated_chunks.update((current) => [...current, ...parsed_chunks]);
        }
        this.streamed_message.set(this.build_text_reply());
        this.scroll_to_bottom();
      }

      const final_reply = this.build_text_reply();

      this.streamed_message.set(null);
      this.last_message.set(null);
      this.chat_messages.update((current) => [
        ...current,
        { role: 'user', content: message },
        { role: 'assistant', content: final_reply },
      ]);
      localStorage.setItem('chat_messages', JSON.stringify(this.chat_messages()));
    } catch {
      this.last_message.set({ content: message, has_failed: true });
    } finally {
      this.assistant_typing.set(false);
      //this.streamed_message.set(null);
      //this.generated_chunks.set([]);
    }
  }

  private parse_stream_chunk(chunk_text: string): StreamChunk[] {
    const chunks: StreamChunk[] = [];
    const lines = chunk_text.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const json_str = line.slice(6).trim();
        if (json_str) {
          try {
            const parsed = JSON.parse(json_str) as StreamChunk;
            chunks.push(parsed);
          } catch { }
        }
      }
    }

    return chunks;
  }

  private build_text_reply(): string {
    return this.generated_chunks()
      .filter((c) => c.type === 'text-delta' && c.delta)
      .map((c) => c.delta!)
      .join('');
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

  async receive_first_message(message?: string) {
    const initial_message = message || '¡Hola!, soy tu asistente, estaré encantado de ayudarte.';
    if (this.chat_messages().length === 0) {
      this.streamed_message.set('');
      for (const char of initial_message) {
        this.streamed_message.update((current) => current + char);
        this.scroll_to_bottom();
        await new Promise((resolve) => setTimeout(resolve, 15));
      }
      this.streamed_message.set(null);
      this.chat_messages.set([
        {
          role: 'assistant',
          content: initial_message,
        },
      ]);
      localStorage.setItem('chat_messages', JSON.stringify(this.chat_messages()));
    }
  }

  private check_and_format_messages(
    messages: { role: 'user' | 'assistant'; content: string }[],
    show_assistant_first_and_last = false,
  ) {
    let valid_messages =
      messages.length > 20 ? messages.slice(messages.length - 20) : [...messages];

    if (show_assistant_first_and_last) {
      while (valid_messages.length > 0 && valid_messages[0].role !== 'assistant') {
        valid_messages.shift();
      }

      while (
        valid_messages.length > 0 &&
        valid_messages[valid_messages.length - 1].role !== 'assistant'
      ) {
        valid_messages.pop();
      }
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
