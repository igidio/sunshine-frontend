import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
} from '@angular/core';
import { FieldControllable } from '../../classes/field-controllable';
import { Field } from '@angular/forms/signals';
import { create_field_error } from '../../helpers/computed-values';

@Component({
  selector: 'ui-field',
  templateUrl: './ui-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiField implements AfterContentInit {
  readonly content = contentChild(FieldControllable);

  _label = input.required<string>();
  _id = input.required<string>();
  field = input.required<Field<any, string | number>>();
  is_error_message_fixed = input(false, {
    transform: booleanAttribute,
  });

  ngAfterContentInit() {
    if (this.content) {
      this.content()!.id_from_label = this._id();
    }
  }

  error_message = create_field_error(this.field);
}
