import type { UiVariants } from '../../data/ui-types';

interface UiButtonColorInterface {
  background: string;
  text: string;
  border: string;
  hover?: string;
  focus?: string;
  shadow?: string;
}

export const ui_button_colors: { [key in UiVariants]: UiButtonColorInterface } = {
  default: {
    background: 'bg-brand',
    text: 'text-white',
    border: 'border border-transparent',
    hover: 'hover:bg-brand-strong',
    focus: 'focus:ring-brand-medium',
    shadow: 'shadow-xs',
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
  },
  danger: {
    background: 'bg-danger',
    text: 'text-white',
    border: 'border border-transparent',
    hover: 'hover:bg-danger-strong',
    focus: 'focus:ring-danger-medium',
    shadow: 'shadow-xs',
  },
  warning: {
    background: 'bg-warning',
    text: 'text-white',
    border: 'border border-transparent',
    hover: 'hover:bg-warning-strong',
    focus: 'focus:ring-warning-medium',
    shadow: 'shadow-xs',
  },
  dark: {
    background: 'bg-dark',
    text: 'text-white',
    border: 'border border-transparent',
    hover: 'hover:bg-dark-strong',
    focus: 'focus:ring-neutral-tertiary',
    shadow: 'shadow-xs',
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
