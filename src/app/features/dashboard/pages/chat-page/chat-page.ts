import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chat-page',
  imports: [],
  templateUrl: './chat-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChatPage {}
