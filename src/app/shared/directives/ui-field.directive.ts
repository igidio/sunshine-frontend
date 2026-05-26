import { AfterContentInit, computed, Directive, input, InputSignal, model } from '@angular/core';
import { Field } from '@angular/forms/signals';
import { create_field_error } from '../helpers/computed-values';

@Directive()
export class UiFieldControl implements AfterContentInit {
  id_from_label?: string;
  id: string | null = null;
  field = input<Field<any, string | number>>();
  value = model<string | number | any | null>(null);
  _id = input<string>('id-textarea');
  error_message = computed(() => {
    const field = this.field();
    return field
      ? create_field_error(this.field as InputSignal<Field<any, string | number>>)()
      : null;
  });

  set_value(target: EventTarget) {
    return (target as HTMLInputElement).value;
  }

  ngAfterContentInit() {
    if (this.id_from_label) {
      this.id = this.id_from_label;
    } else {
      this.id = this._id();
    }
  }
}
