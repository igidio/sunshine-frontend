import { Component, input, ChangeDetectionStrategy, booleanAttribute } from '@angular/core';
import { ui_badge_variants, UiBadgeVariants } from './ui-badge-variants';
import { IconValue } from '../../data/icons';
import { NgClass } from '@angular/common';
import { UiIcon } from '../ui-icon/ui-icon';

@Component({
  selector: 'ui-badge',
  templateUrl: './ui-badge.html',
  imports: [NgClass, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBadge {
  _label = input<string | null>(null);
  variant = input<UiBadgeVariants>('brand');
  bordered = input(false, {
    transform: booleanAttribute,
  });
  large = input(false, {
    transform: booleanAttribute,
  });
  pill = input(false, {
    transform: booleanAttribute,
  });
  icon = input<IconValue | null>(null);
  dot = input(false, {
    transform: booleanAttribute,
  });
  on_dismiss = input<(() => void) | null>(null);

  get variant_classes() {
    const { border, dot, ...variant } = ui_badge_variants[this.variant()];
    return {
      ...variant,
      bordered: this.bordered() ? border : '',
      dot: this.dot() ? dot : '',
      size: this.large() ? 'px-2 py-1 text-sm' : 'px-1.5 py-0.5 text-xs',
      pill: this.pill() ? 'rounded-full' : 'rounded',
      icon: this.icon() ? 'inline-flex items-center gap-1' : '',
    };
  }
}
