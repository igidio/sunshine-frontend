import {
  Component,
  input,
  ChangeDetectionStrategy,
  AfterContentInit,
  computed,
} from '@angular/core';
import { FieldControllable } from '../../classes/field-controllable';
import { Field, FormField } from '@angular/forms/signals';
import { create_field_error } from '@/app/shared/helpers/computed-values';

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
  imports: [FormField],
})
export class UiInput implements AfterContentInit, FieldControllable {
  id_from_label?: string;

  _placeholder = input<string>('');
  _type = input<string>('text');
  _id = input<string>('default-id');
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
