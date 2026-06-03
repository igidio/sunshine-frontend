import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FieldControllable } from '../../classes/field-controllable';
import { UiFieldControl } from '../../directives/ui-field.directive';
import { InputDirective } from '../../directives/input.directive';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'ui-select',
  templateUrl: './ui-select.html',
  providers: [
    {
      provide: FieldControllable,
      useExisting: UiSelect,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: InputDirective,
      inputs: ['field', 'value'],
      outputs: ['valueChange'],
    },
  ],
})
export class UiSelect extends UiFieldControl implements FieldControllable {
  _placeholder = input<string>('');
  options = input<SelectOption[]>([]);
  readonly model = inject(InputDirective<string | number>).adapter;
}
