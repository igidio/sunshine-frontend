import { Component, input, ChangeDetectionStrategy, booleanAttribute, signal } from '@angular/core';
import { ui_alert_variants, UiAlertVariants } from './ui-alert-variants';
import { IconValue } from '../../data/icons';
import { NgClass } from '@angular/common';
import { UiIcon } from '../ui-icon/ui-icon';

@Component({
  selector: 'ui-alert',
  templateUrl: './ui-alert.html',
  imports: [NgClass, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiAlert {
  _label = input<string | null>(null);
  variant = input<UiAlertVariants>('info');
  icon = input<IconValue | null>(null);
  bordered = input(false, {
    transform: booleanAttribute,
  });
  border_accent = input(false, {
    transform: booleanAttribute,
  });
  dismissible = input(false, {
    transform: booleanAttribute,
  });
  visible = signal(true);

  get variant_classes() {
    const variant = ui_alert_variants[this.variant()];
    return {
      background: variant.background,
      text: variant.text,
      bordered: this.bordered() ? variant.bordered : '',
      border_accent: this.border_accent() ? variant.border_accent : '',
      dismiss_hover: variant.dismiss_hover,
      dismiss_focus: variant.dismiss_focus,
    };
  }

  dismiss() {
    this.visible.set(false);
  }
}
