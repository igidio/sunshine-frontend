import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  message: string;
  type?: 'success' | 'danger' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);
  private next_id = 0;

  show(message: string, duration: number = 3000, type?: 'success' | 'danger' | 'info' | 'warning') {
    const id = this.next_id++;
    const new_toast: ToastMessage = { id, message, type };

    this.toasts.update((current) => [...current, new_toast]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: number) {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
