import { ChangeDetectionStrategy, Component, inject, signal, viewChild, TemplateRef } from '@angular/core';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { ModalService } from '@/app/shared/services/modal.service';
import { ToastService } from '@/app/shared/services/toast.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'chat-access',
  imports: [UiButton, UiInput, UiField],
  templateUrl: './chat-access.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatAccess {
  private profileService = inject(ProfileService);
  private modalService = inject(ModalService);
  private toastService = inject(ToastService);

  is_generating = signal(false);
  generated_key = signal<string | null>(null);

  key_modal = viewChild.required<TemplateRef<any>>('key_modal');

  async generate_key() {
    this.is_generating.set(true);

    try {
      const response = await this.profileService.generate_chat_access();

      this.generated_key.set(response.chat_access);

      this.modalService.open();
      this.modalService.set_header({ title: 'Clave de acceso de chat' });
      this.modalService.set_content(this.key_modal());
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
    } catch {
      this.toastService.show({
        message: 'Error al generar la clave de acceso',
        duration: 4000,
        type: 'danger',
      });
    } finally {
      this.is_generating.set(false);
    }
  }

  copy_key() {
    const key = this.generated_key();

    if (!key) return;

    navigator.clipboard.writeText(key);

    this.toastService.show({
      message: 'Clave copiada al portapapeles',
      duration: 2000,
      type: 'success',
    });
  }
}
