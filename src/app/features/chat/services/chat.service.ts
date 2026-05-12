import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  show_chat_window = signal<boolean>(false);

  toggle_chat_window(state?: boolean) {
    this.show_chat_window.update((current) => state ?? !current);
  }
}
