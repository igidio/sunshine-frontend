import { Component, input, ChangeDetectionStrategy, inject } from '@angular/core';
import { FieldControllable } from '../../classes/field-controllable';
import { UiFieldControl } from '../../directives/ui-field.directive';
import { InputDirective } from '../../directives/input.directive';

@Component({
  selector: 'ui-input',
  templateUrl: './ui-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: FieldControllable,
      useExisting: UiInput,
    },
  ],
})
export class UiInput extends UiFieldControl implements FieldControllable {
  _placeholder = input<string>('');
  _type = input<string>('text');
  readonly model = inject(InputDirective<string | number>).adapter;
}
