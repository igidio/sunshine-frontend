import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-card',
  templateUrl: './ui-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCard {
  class = input<string>('');
}
