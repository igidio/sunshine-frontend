import { NgClass } from '@angular/common';
import { Component, input, ChangeDetectionStrategy, booleanAttribute } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';
import { UiTooltip } from '../ui-tooltip/ui-tooltip';
import { UiIcon } from '../ui-icon/ui-icon';

@Component({
  selector: 'ui-card',
  templateUrl: './ui-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, UiButton, UiTooltip, UiIcon],
})
export class UiCard {
  _class = input('');
  unwrap = input(false, {
    transform: booleanAttribute,
  });
  header_loading = input(false, {
    transform: booleanAttribute,
  });
  header_label = input<string | null>(null);
  header_revert = input<() => void>(undefined, { alias: 'on_revert' });
  header_reload = input<() => void>(undefined, { alias: 'on_reload' });
}
