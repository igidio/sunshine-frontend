import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { ProfileService } from '../../services/profile.service';

const COOLDOWN_KEY = 'profile:confirm_cooldown_until';
const COOLDOWN_MS = 5 * 60 * 1000;

@Component({
  selector: 'send-confirmation',
  imports: [UiButton],
  template: `
    <ui-button
      [_label]="button_label()"
      icon="mail"
      variant="secondary"
      size="lg"
      block
      [is_spinning]="is_sending()"
      [disabled]="is_cooldown()"
      (click)="send()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendConfirmation {
  private profileService = inject(ProfileService);
  private destroyRef = inject(DestroyRef);

  is_sending = signal(false);
  is_cooldown = signal(false);
  cooldown_display = signal('');

  button_label = computed(() => {
    if (this.is_cooldown()) {
      return `Reenviar correo (${this.cooldown_display()})`;
    }
    return 'Reenviar correo de confirmación';
  });

  constructor() {
    this.restore_cooldown();
  }

  private restore_cooldown() {
    const stored = localStorage.getItem(COOLDOWN_KEY);

    if (!stored) return;

    const unlock_after = parseInt(stored, 10);
    const remaining = unlock_after - Date.now();

    if (remaining > 0) {
      this.start_cooldown(remaining);
    } else {
      localStorage.removeItem(COOLDOWN_KEY);
    }
  }

  private start_cooldown(duration_ms: number = COOLDOWN_MS) {
    const unlock_after = Date.now() + duration_ms;

    localStorage.setItem(COOLDOWN_KEY, unlock_after.toString());
    this.is_cooldown.set(true);
    this.update_display(duration_ms);

    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const remaining = unlock_after - Date.now();

        if (remaining <= 0) {
          this.is_cooldown.set(false);
          this.cooldown_display.set('');
          localStorage.removeItem(COOLDOWN_KEY);
          return;
        }

        this.update_display(remaining);
      });
  }

  private update_display(ms: number) {
    const total_seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(total_seconds / 60);
    const seconds = total_seconds % 60;

    this.cooldown_display.set(
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    );
  }

  async send() {
    this.is_sending.set(true);
    try {
      await this.profileService.send_confirmation().then(() => {
        this.start_cooldown();
      });

    } finally {
      this.is_sending.set(false);
    }
  }
}
