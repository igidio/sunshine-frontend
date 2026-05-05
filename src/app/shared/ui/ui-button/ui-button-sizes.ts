import { UiSizes } from '../../data/ui-types';

interface UiButtonSizeInterface {
  text: string;
  px: string;
  py: string;
  p?: string;
}

export const ui_button_sizes: { [key in UiSizes]: UiButtonSizeInterface } = {
  xs: {
    text: 'text-xs',
    px: 'px-3',
    py: 'py-1.5',
    p: 'p-1.5',
  },
  sm: {
    text: 'text-sm',
    px: 'px-3',
    py: 'py-2',
    p: 'p-2',
  },
  md: {
    text: 'text-sm',
    px: 'px-4',
    py: 'py-2.5',
    p: 'p-2.5',
  },
  lg: {
    text: 'text-base',
    px: 'px-5',
    py: 'py-3',
    p: 'p-3',
  },
  xl: {
    text: 'text-base',
    px: 'px-6',
    py: 'py-3.5',
    p: 'p-3.5',
  },
} as const;
