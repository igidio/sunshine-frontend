export type UiBadgeVariants = 'brand' | 'alternative' | 'gray' | 'danger' | 'success' | 'warning';

interface UiBadgeColorInterface {
  background: string;
  text: string;
  border: string;
  dot: string;
}

export const ui_badge_variants: { [key in UiBadgeVariants]: UiBadgeColorInterface } = {
  brand: {
    background: 'bg-brand-softer',
    text: 'text-fg-brand-strong',
    border: ' border border-brand-subtle',
    dot: 'bg-brand-softer',
  },
  alternative: {
    background: 'bg-neutral-primary-soft',
    text: 'text-heading',
    border: 'border border-default',
    dot: 'bg-fg-brand-strong',
  },
  gray: {
    background: 'bg-neutral-secondary-medium',
    text: 'text-heading',
    border: 'border border-default-medium',
    dot: 'bg-heading',
  },
  danger: {
    background: 'bg-danger-soft',
    text: 'text-fg-danger-strong',
    border: 'border border-danger-subtle',
    dot: 'bg-fg-danger-strong',
  },
  success: {
    background: 'bg-success-soft',
    text: 'text-fg-success-strong',
    border: 'border border-success-subtle',
    dot: 'bg-fg-success-strong',
  },
  warning: {
    background: 'bg-warning-soft',
    text: 'text-fg-warning',
    border: 'border border-warning-subtle',
    dot: 'bg-fg-warning',
  },
} as const;
