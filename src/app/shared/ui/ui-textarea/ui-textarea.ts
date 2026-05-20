import { AfterContentInit, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldControllable } from '../../classes/field-controllable';
import { create_field_error } from '../../helpers/computed-values';
import { Field, FormField } from '@angular/forms/signals';

@Component({
  selector: 'ui-textarea',
  imports: [FormField],
  templateUrl: './ui-textarea.html',
  providers: [
    {
      provide: FieldControllable,
      useExisting: UiPlaceholder,
    },
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiPlaceholder implements AfterContentInit, FieldControllable {
  id_from_label?: string;

  _placeholder = input<string>('');
  _id = input<string>('default-id');
  rows = input<number>(4);
  field = input.required<Field<any, string | number>>();
  id: string | null = null;

  ngAfterContentInit() {
    if (this.id_from_label) {
      this.id = this.id_from_label;
    } else {
      this.id = this._id();
    }
  }

  error_message = create_field_error(this.field);
}
