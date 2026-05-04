import { computed, InputSignal } from '@angular/core';
import { Field } from '@angular/forms/signals';

export function create_field_error(field: InputSignal<Field<any, string | number>>) {
  return computed<string | undefined>(() => {
    const errors = field()().errors?.();
    return errors?.length ? errors[0].message : undefined;
  });
}
