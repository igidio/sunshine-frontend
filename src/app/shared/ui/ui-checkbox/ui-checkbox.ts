import { Component, input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ui-checkbox',
  templateUrl: './ui-checkbox.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class UiCheckbox {
  a_label = input<string>('Default checkbox');
  form_control_name = input.required<string>();
  a_id = input<string>('default-checkbox');
}
