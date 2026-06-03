export type UiAlertVariants = 'info' | 'danger' | 'success' | 'warning' | 'dark';

interface UiAlertColorInterface {
  background: string;
  text: string;
  bordered: string;
  border_accent: string;
  dismiss_hover: string;
  dismiss_focus: string;
}

export const ui_alert_variants: { [key in UiAlertVariants]: UiAlertColorInterface } = {
  info: {
    background: 'bg-brand-softer',
    text: 'text-fg-brand-strong',
    bordered: 'border border-brand-subtle',
    border_accent: 'border-t-4 border-brand-subtle',
    dismiss_hover: 'hover:bg-brand-soft',
    dismiss_focus: 'focus:ring-brand-medium',
  },
  danger: {
    background: 'bg-danger-soft',
    text: 'text-fg-danger-strong',
    bordered: 'border border-danger-subtle',
    border_accent: 'border-t-4 border-danger-subtle',
    dismiss_hover: 'hover:bg-danger-medium',
    dismiss_focus: 'focus:ring-danger-medium',
  },
  success: {
    background: 'bg-success-soft',
    text: 'text-fg-success-strong',
    bordered: 'border border-success-subtle',
    border_accent: 'border-t-4 border-success-subtle',
    dismiss_hover: 'hover:bg-success-medium',
    dismiss_focus: 'focus:ring-success-medium',
  },
  warning: {
    background: 'bg-warning-soft',
    text: 'text-fg-warning',
    bordered: 'border border-warning-subtle',
    border_accent: 'border-t-4 border-warning-subtle',
    dismiss_hover: 'hover:bg-warning-medium',
    dismiss_focus: 'focus:ring-warning-medium',
  },
  dark: {
    background: 'bg-neutral-secondary-medium',
    text: 'text-heading',
    bordered: 'border border-default-medium',
    border_accent: 'border-t-4 border-default-medium',
    dismiss_hover: 'hover:bg-neutral-tertiary-medium',
    dismiss_focus: 'focus:ring-neutral-tertiary',
  },
};
