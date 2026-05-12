import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiDropdown } from '@/app/shared/ui/ui-dropdown/ui-dropdown';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiDropdownItem } from '@/app/shared/data/ui-types';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'chat-dropdown',
  imports: [UiDropdown, UiButton],
  templateUrl: './chat-dropdown.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatDropdown {
  chatService = inject(ChatService);

  items: UiDropdownItem[][] = [
    [
      {
        icon: 'delete',
        label: 'Eliminar chat',
        on_click: () => this.chatService.delete_messages(),
      },
    ],
  ];
}
