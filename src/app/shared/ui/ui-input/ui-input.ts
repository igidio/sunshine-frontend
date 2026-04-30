import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { FieldControllable } from '../../classes/field-controllable';

@Component({
  selector: 'ui-input',
  templateUrl: './ui-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  providers: [
    {
      provide: FieldControllable,
      useExisting: UiInput,
    },
  ],
})
export class UiInput implements FieldControllable {
  _placeholder = input<string>('');
  _type = input<string>('text');
  form_control_name = input.required<string>();
  id: string = 'default-id';
}
