import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { FieldControllable } from './field-controllable';
import { Directive, input } from '@angular/core';

@Directive()
export class FormControlHost implements FieldControllable {
  form_control_name = input.required<string>();
  id = '';

  constructor(public controlContainer: ControlContainer) {}

  get parent_control() {
    return this.controlContainer.control as FormGroup;
  }

  get form_field() {
    return this.parent_control.get(this.form_control_name());
  }
}
