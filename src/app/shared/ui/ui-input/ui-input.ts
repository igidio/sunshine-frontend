import {
  Component,
  input,
  ChangeDetectionStrategy,
  contentChild,
  AfterContentInit,
} from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { FieldControllable } from '../../classes/field-controllable';
import { Field, FieldState, FieldTree, FormField } from '@angular/forms/signals';

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
    console.log(this.id_from_label);

    if (this.id_from_label) {
      this.id = this.id_from_label;
    } else {
      this.id = this._id();
    }
  }
}
