import { computed, Directive, input, InputSignal } from '@angular/core';
import { Field } from '@angular/forms/signals';
import { create_field_error } from '../helpers/computed-values';

@Directive()
export class UiFieldControl {
  field = input<Field<any, string | number>>();
  error_message = computed(() => {
    const field = this.field();
    return field
      ? create_field_error(this.field as InputSignal<Field<any, string | number>>)()
      : null;
  });

  set_value(target: EventTarget) {
    return (target as HTMLInputElement).value;
  }
}
