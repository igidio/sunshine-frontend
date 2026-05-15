import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';

@Component({
  selector: 'ui-checkbox',
  templateUrl: './ui-checkbox.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField],
})
export class UiCheckbox {
  _label = input<string>('Default checkbox');
  _id = input<string>('default-checkbox');
  field = input.required<Field<any, string | number>>();
}
