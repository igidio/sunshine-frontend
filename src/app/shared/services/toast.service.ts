import { Injectable, signal } from '@angular/core';
import { IconValue } from '../data/icons';
import { UiVariants } from '../data/ui-types';

export interface ToastMessage {
  id: number;
  message: string;
  type?: 'success' | 'danger' | 'info' | 'warning';
  buttons?: ToastButton[];
  is_closable?: boolean;
}
interface ToastButton {
  label: string;
  action: () => void;
  icon?: IconValue;
  color?: UiVariants;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);
  private next_id = 0;
  max_toasts = 4;

  show({
    message,
    duration = 3000,
    type,
    buttons = [],
    is_closable = true,
  }: {
    message: string;
    duration?: number;
    type?: 'success' | 'danger' | 'info' | 'warning';
    buttons?: ToastButton[];
    is_closable?: boolean;
  }) {
    const id = this.next_id++;
    const new_toast: ToastMessage = { id, message, type, buttons, is_closable };

    this.toasts.update((current) => {
      const next_toasts = [...current, new_toast];
      return next_toasts.length > this.max_toasts
        ? next_toasts.slice(-this.max_toasts)
        : next_toasts;
    });

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: number) {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
