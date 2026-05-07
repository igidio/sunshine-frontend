import { Component, input, ChangeDetectionStrategy, booleanAttribute } from '@angular/core';

@Component({
  selector: 'ui-card',
  templateUrl: './ui-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCard {
  unwrap = input(false, {
    transform: booleanAttribute,
  });
}
