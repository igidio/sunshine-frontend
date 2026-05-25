import {
  AfterContentInit,
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
import { UiFieldControl } from '../../directives/ui-field.directive';

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
export class UiField extends UiFieldControl implements AfterContentInit {
  readonly content = contentChild(FieldControllable);
  model = inject(InputDirective).adapter;
  _label = input.required<string>();
  is_error_message_fixed = input(false, {
    transform: booleanAttribute,
  });
  required = input(false, {
    transform: booleanAttribute,
  });
}
