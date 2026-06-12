import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { StreamChunk } from '../../interfaces/chat.interface';

import { UiBadge } from '../../../../shared/ui/ui-badge/ui-badge';
import { UiIcon } from "@/app/shared/ui/ui-icon/ui-icon";

@Component({
  selector: 'chat-streamed',
  imports: [UiBadge, UiIcon],
  templateUrl: './chat-streamed.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ChatStreamed {
  chatService = inject(ChatService);
  included_types = ['text-delta', 'reasoning-delta', 'tool-input-available', 'error'];

  grouped_chunks = computed(() => {
    const chunks = this.chatService.generated_chunks();
    const groups: StreamChunk[] = [];

    for (const chunk of chunks) {
      const last = groups[groups.length - 1];
      const is_text_type =
        chunk.type === 'text-delta' || chunk.type === 'reasoning-delta';

      if (last && last.type === chunk.type && is_text_type) {
        last.delta = (last.delta || '') + (chunk.delta || '');
      } else {
        if (!this.included_types.includes(chunk.type)) continue;
        groups.push({ ...chunk });
      }
    }

    return groups;
  });
}
