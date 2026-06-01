import { ChangeDetectionStrategy, Component, DOCUMENT, inject, viewChild } from '@angular/core';
import { UiDropdown } from '@/app/shared/ui/ui-dropdown/ui-dropdown';
import { UiDropdownItem } from '@/app/shared/data/ui-types';
import { ChatService } from '../../services/chat.service';
import { ToastService } from '@/app/shared/services/toast.service';

@Component({
  selector: 'chat-dropdown',
  imports: [UiDropdown],
  templateUrl: './chat-dropdown.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatDropdown {
  chatService = inject(ChatService);
  toastService = inject(ToastService);
  document = inject(DOCUMENT);
  dropdown_ref = viewChild<UiDropdown>('dropdown');

  items: UiDropdownItem[][] = [
    [
      {
        icon: 'delete',
        label: 'Eliminar chat',
        on_click: () => {
          this.chatService.delete_messages();
          this.dropdown_ref()?.hide();
          this.toastService.show({
            message: 'Chat eliminado correctamente',
            type: 'success',
            duration: 3000,
          });
        },
      },
    ],
  ];
}
