import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  input,
  InputSignal,
} from '@angular/core';
import { FieldControllable } from '../../classes/field-controllable';
import { Field } from '@angular/forms/signals';
import { create_field_error } from '../../helpers/computed-values';
import { InputDirective } from '../../directives/input.directive';

@Component({
  selector: 'ui-field',
  templateUrl: './ui-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: InputDirective,
      inputs: ['field', 'value'],
      outputs: ['valueChange'],
    },
  ],
})
export class UiField {
  readonly content = contentChild(FieldControllable);
  model = inject(InputDirective).adapter;
  field = input<Field<any, string | number>>();
  _label = input.required<string>();
  _id = input<string>('id-textarea');
  is_error_message_fixed = input(false, {
    transform: booleanAttribute,
  });
  required = input(false, {
    transform: booleanAttribute,
  });

  error_message = computed(() => {
    const field = this.field();
    return field
      ? create_field_error(this.field as InputSignal<Field<any, string | number>>)()
      : null;
  });
}
