import { Component, input, ChangeDetectionStrategy, booleanAttribute } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { ui_button_colors } from './ui-button-colors';
import { UiVariants } from '../../data/ui-variants';

@Component({
  selector: 'ui-button',
  templateUrl: './ui-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class UiButton {
  a_type = input<'submit' | 'button' | 'reset'>('button');
  a_label = input.required<string>();
  a_id = input<string>('default-button');
  variant = input<UiVariants>('default');
  block = input(false, {
    transform: booleanAttribute,
  });

  get variantClasses() {
    const variant = ui_button_colors[this.variant()] ?? ui_button_colors.default;
    return [variant.background, variant.text, variant.border, variant.hover, variant.focus]
      .filter(Boolean)
      .join(' ');
  }
}
