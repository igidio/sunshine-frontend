import { booleanAttribute, ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';

type Placeholder = 'supplier' | 'image';

@Component({
  selector: 'ui-image',
  imports: [UiIcon],
  templateUrl: './ui-image.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiImage {
  url = input<string | null>(null);
  placeholder = input<Placeholder>('image');
  is_square = input(false, {
    transform: booleanAttribute,
  });

  height = input<number | null>(null);
  _class = input<string>('');
}
