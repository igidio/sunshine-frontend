import { computed, Directive, input, model } from '@angular/core';
import { Field } from '@angular/forms/signals';

export type ModelAdapter<T> = {
  get: () => T | null;
  set: (v: T | null) => void;
  dirty: () => void;
  touched: () => void;
};

@Directive({
  selector: '[uiFieldModel]',
})
export class InputDirective<T extends string | number> {
  field = input<Field<any, T> | null>(null);
  value = model<T | null>(null);

  adapter = computed<ModelAdapter<T>>(() => {
    const f = this.field();
    if (f) {
      return {
        get: () => f().value(),
        set: (v) => f().value.set(v),
        dirty: () => f().markAsDirty(),
        touched: () => f().markAsTouched(),
      };
    }
    return {
      get: () => this.value(),
      set: (v) => this.value.set(v),
      dirty: () => {},
      touched: () => {},
    };
  });
}
