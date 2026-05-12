import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { ChatService } from '@/app/features/chat/services/chat.service';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';
import { ChatInput } from '@/app/features/chat/components/chat-input/chat-input';
import { ChatScroll } from '@/app/features/chat/components/chat-scroll/chat-scroll';
import { DashboardDropdownProfile } from '../../components/dashboard-dropdown-profile/dashboard-dropdown-profile';
import { ChatDropdown } from '@/app/features/chat/components/chat-dropdown/chat-dropdown';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chat-page',
  imports: [UiIcon, ChatInput, ChatScroll, ChatDropdown, UiButton],
  templateUrl: './chat-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChatPage implements AfterViewInit {
  chatService = inject(ChatService);

  ngAfterViewInit() {
    this.chatService.receive_first_message();
  }
}
