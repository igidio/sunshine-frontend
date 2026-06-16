import { Component, input, ChangeDetectionStrategy, inject, booleanAttribute } from '@angular/core';
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
  hostDirectives: [
    {
      directive: InputDirective,
      inputs: ['field', 'value'],
      outputs: ['valueChange'],
    },
  ],
})
export class UiInput extends UiFieldControl implements FieldControllable {
  _placeholder = input<string>('');
  _type = input<string>('text');
  readonly = input(false, {
    transform: booleanAttribute,
  });
  readonly model = inject(InputDirective<string | number>).adapter;
}
