import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-checkbox',
  templateUrl: './ui-checkbox.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCheckbox {
  _label = input<string>('Default checkbox');
  _id = input<string>('default-checkbox');
}
