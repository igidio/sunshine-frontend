import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { marked } from 'marked';

@Component({
  selector: 'chat-bubble',
  imports: [NgClass],
  templateUrl: './chat-bubble.html',
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatBubble {
  side = input.required<'user' | 'assistant'>();
  content = input<string>();
  class = input<string>('');

  parseMarkdown(content: string): string {
    return marked.parse(content, { async: false }) as string;
  }
}
