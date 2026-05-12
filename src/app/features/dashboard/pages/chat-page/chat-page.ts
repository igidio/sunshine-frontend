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

@Component({
  selector: 'app-chat-page',
  imports: [UiIcon, ChatInput, ChatScroll],
  templateUrl: './chat-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChatPage {
  chatService = inject(ChatService);
}
