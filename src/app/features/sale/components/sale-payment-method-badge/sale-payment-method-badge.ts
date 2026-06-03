import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';
import type { UiBadgeVariants } from '@/app/shared/ui/ui-badge/ui-badge-variants';
import { payment_methods_labeled, payment_methods_colors } from '../../data/sale.data';

@Component({
    selector: 'sale-payment-method-badge',
    imports: [UiBadge],
    template: `
    <ui-badge
      [_label]="label()"
      [variant]="variant()"
      [large]="large()"
    />
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalePaymentMethodBadge {
    payment_method = input.required<string>();
    large = input(false);

    label = computed(() => payment_methods_labeled[this.payment_method()] || this.payment_method());
    variant = computed<UiBadgeVariants>(() => (payment_methods_colors[this.payment_method()] as UiBadgeVariants) || 'brand');
}
