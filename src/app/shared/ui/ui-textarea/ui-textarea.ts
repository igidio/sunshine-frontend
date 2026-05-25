import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FieldControllable } from '../../classes/field-controllable';
import { UiFieldControl } from '../../directives/ui-field.directive';
import { InputDirective } from '../../directives/input.directive';

@Component({
  selector: 'ui-textarea',
  templateUrl: './ui-textarea.html',
  providers: [
    {
      provide: FieldControllable,
      useExisting: UiPlaceholder,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiPlaceholder extends UiFieldControl implements FieldControllable {
  _placeholder = input<string>('');
  rows = input<number>(4);
  readonly model = inject(InputDirective<string | number>).adapter;
}
