import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  viewChild,
  TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';
import { ProfileService } from '../../services/profile.service';
import { ModalService } from '@/app/shared/services/modal.service';
import { ToastService } from '@/app/shared/services/toast.service';

const COOLDOWN_KEY = 'profile:confirm_cooldown_until';
const COOLDOWN_MS = 5 * 60 * 1000;

@Component({
  selector: 'send-confirmation',
  imports: [UiButton, UiIcon],
  templateUrl: './send-confirmation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendConfirmation {
  private profileService = inject(ProfileService);
  private modalService = inject(ModalService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  is_sending = signal(false);
  is_cooldown = signal(false);
  cooldown_display = signal('');
  confirmation_link = signal<string | null>(null);

  private confirmed_modal = viewChild.required<TemplateRef<any>>('confirmed_modal');
  private link_modal = viewChild.required<TemplateRef<any>>('link_modal');

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
      const response = await this.profileService.send_confirmation();
      //this.start_cooldown();
      if (response && typeof response.token === 'string') {
        this.confirmation_link.set(response.token);
        this.modalService.open();
        this.modalService.set_header({ title: 'Confirma tu cuenta' });
        this.modalService.set_content(this.link_modal());
        this.modalService.set_footer({
          right_buttons: [
            {
              label: 'Cerrar',
              action: () => this.modalService.close(),
              variant: 'secondary',
              size: 'md',
            },
          ],
        });
      } else {
        this.modalService.open();
        this.modalService.set_header({ title: 'Correo enviado' });
        this.modalService.set_content(this.confirmed_modal());
        this.modalService.set_footer({
          right_buttons: [
            {
              label: 'Cerrar',
              action: () => this.modalService.close(),
              variant: 'secondary',
              size: 'md',
            },
          ],
        });
      }
    } catch {
      this.toastService.show({
        message: 'Error al enviar el correo de confirmación',
        duration: 4000,
        type: 'danger',
      });
    } finally {
      this.is_sending.set(false);
    }
  }
}
