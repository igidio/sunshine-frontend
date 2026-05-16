import { Component, input, ChangeDetectionStrategy, booleanAttribute } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { ui_button_colors } from './ui-button-colors';
import { UiSizes, UiVariants } from '../../data/ui-types';
import { IconValue } from '../../data/icons';
import { UiIcon } from '../ui-icon/ui-icon';
import { NgClass } from '@angular/common';
import { ui_button_sizes } from './ui-button-sizes';
import { get_ui_classes, pick_classes } from '../../helpers/get-ui-classes';

@Component({
  selector: 'ui-button',
  templateUrl: './ui-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, UiIcon, NgClass],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class UiButton {
  ui_button_sizes = ui_button_sizes;

  _type = input<'submit' | 'button' | 'reset'>('button');
  _label = input<string | null>();
  _id = input<string>('default-button');
  icon = input<IconValue | null>();
  variant = input<UiVariants>('default');
  rounded = input(false, {
    transform: booleanAttribute,
  });
  size = input<UiSizes>('md');
  block = input(false, {
    transform: booleanAttribute,
  });
  outline = input(false, {
    transform: booleanAttribute,
  });

  get variant_classes() {
    const variant = ui_button_colors[this.variant()] ?? ui_button_colors.default;
    return {
      base: pick_classes(variant, ['background', 'text', 'border', 'hover', 'focus', 'shadow']),
      outline: pick_classes(variant, ['outline']),
    };
  }

  get size_classes() {
    const size = ui_button_sizes[this.size()];

    return {
      ...size,
      padding_full: pick_classes(size, ['p']),
      padding_xy: pick_classes(size, ['px', 'py']),
    };
  }
}
