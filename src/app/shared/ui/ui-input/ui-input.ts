import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

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
})
export class UiInput {
  id = input.required<string>();
  placeholder = input<string>('');
  type = input<string>('text');
  form_control_name = input.required<string>();
}
