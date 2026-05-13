import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SseService {
  private router = inject(Router);
  private endpoint = '/api/sse';
  private events_signal = signal<MessageEvent | null>(null);
  private error_signal = signal<Event | null>(null);
  private is_connected_signal = signal(false);
  private event_source = signal<EventSource | null>(null);

  connect() {
    this.event_source.set(new EventSource(this.endpoint));

    this.event_source()!.onopen = () => {
      this.is_connected_signal.set(true);
    };

    this.event_source()!.addEventListener('connect', () => {
      this.events_signal.set(new MessageEvent('connect'));
    });

    this.event_source()!.onerror = (error) => {
      console.error('SSE desconectado:', error);
      this.error_signal.set(error);
      this.is_connected_signal.set(false);
    };
  }

  add_event(event_name: string, handler: () => void, allowed_routes: string[] = []) {
    const current_route = this.router.url;

    if (allowed_routes.length > 0 && !allowed_routes.includes(current_route)) {
      return;
    }

    this.event_source()!.addEventListener(event_name, handler);
  }

  remove_event(event_name: string, handler: () => void) {
    this.event_source()!.removeEventListener(event_name, handler);
  }

  disconnect() {
    if (this.event_source()) {
      this.event_source()!.close();
      this.is_connected_signal.set(false);
    }
  }
}
