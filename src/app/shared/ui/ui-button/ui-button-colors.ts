import type { UiVariants } from '../../data/ui-types';

interface UiButtonColorInterface {
  background: string;
  text: string;
  border: string;
  hover?: string;
  focus?: string;
  shadow?: string;
  outline?: string;
  soft?: string;
}

export const ui_button_colors: { [key in UiVariants]: UiButtonColorInterface } = {
  default: {
    background: 'bg-brand',
    text: 'text-white',
    border: 'border border-transparent',
    hover: 'hover:bg-brand-strong',
    focus: 'focus:ring-brand-medium',
    shadow: 'shadow-xs',
    outline:
      'bg-neutral-primary/20! text-fg-brand! border! border-brand! hover:bg-brand! hover:text-white!',
    soft: 'bg-brand-softer! text-fg-brand-strong! border! border-brand-subtle! hover:bg-brand-softer! hover:text-fg-brand-strong!',
  },
  secondary: {
    background: 'bg-neutral-secondary-medium',
    text: 'text-body',
    border: 'border border-default-medium',
    hover: 'hover:bg-neutral-tertiary-medium hover:text-heading',
    focus: 'focus:ring-neutral-tertiary',
    shadow: 'shadow-xs',
  },
  tertiary: {
    background: 'bg-neutral-primary-soft',
    text: 'text-body',
    border: 'border border-default',
    hover: 'hover:bg-neutral-secondary-medium hover:text-heading',
    focus: 'focus:ring-neutral-tertiary-soft',
    shadow: 'shadow-xs',
  },
  success: {
    background: 'bg-success',
    text: 'text-white',
    border: 'border border-transparent',
    hover: 'hover:bg-success-strong',
    focus: 'focus:ring-success-medium',
    shadow: 'shadow-xs',
    outline:
      'bg-neutral-primary/20! text-fg-success! border! border-success! hover:bg-success! hover:text-white!',
    soft: 'bg-success-soft! text-fg-success-strong! border! border-success-subtle! hover:bg-success-soft! hover:text-fg-success-strong!',
  },
  danger: {
    background: 'bg-danger',
    text: 'text-white',
    border: 'border border-transparent',
    hover: 'hover:bg-danger-strong',
    focus: 'focus:ring-danger-medium',
    shadow: 'shadow-xs',
    outline:
      'bg-neutral-primary/20! text-fg-danger! border! border-danger! hover:bg-danger! hover:text-white!',
    soft: 'bg-danger-soft! text-fg-danger-strong! border! border-danger-subtle! hover:bg-danger-soft! hover:text-fg-danger-strong!',
  },
  warning: {
    background: 'bg-warning',
    text: 'text-white',
    border: 'border border-transparent',
    hover: 'hover:bg-warning-strong',
    focus: 'focus:ring-warning-medium',
    shadow: 'shadow-xs',
    outline:
      'bg-neutral-primary/20! text-fg-warning! border! border-warning! hover:bg-warning! hover:text-white!',
    soft: 'bg-warning-soft! text-fg-warning-strong! border! border-warning-subtle! hover:bg-warning-soft! hover:text-fg-warning-strong!',
  },
  dark: {
    background: 'bg-dark',
    text: 'text-white',
    border: 'border border-transparent',
    hover: 'hover:bg-dark-strong',
    focus: 'focus:ring-neutral-tertiary',
    shadow: 'shadow-xs',
    outline:
      'bg-neutral-primary/20! text-fg-dark! border! border-dark! hover:bg-dark! hover:text-white!',
    soft: 'bg-dark-soft! text-fg-dark-strong! border! border-dark-subtle! hover:bg-dark-soft! hover:text-fg-dark-strong!',
  },
  ghost: {
    background: 'bg-transparent',
    text: 'text-heading',
    border: 'border border-transparent',
    hover: 'hover:bg-neutral-secondary-medium',
    focus: 'focus:ring-neutral-tertiary',
  },
} as const;

//export type UiButtonVariant = keyof typeof ui_button_colors;
