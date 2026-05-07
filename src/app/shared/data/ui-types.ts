import { UiBadgeVariants } from '../ui/ui-badge/ui-badge-variants';
import { IconValue } from './icons';

export type UiVariants =
  | 'default'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'dark'
  | 'ghost';

export type UiSizes = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface UiDropdownItem {
  label: string;
  icon?: IconValue;
  href?: string;
  helper_text?: string;
  wrap?: boolean;
  on_click?: () => void;
  badge?: {
    label: string;
    variant?: UiBadgeVariants;
  };
  items?: UiDropdownItem[][];
}
