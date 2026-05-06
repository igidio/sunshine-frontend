import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { UiButton } from '../ui-button/ui-button';
import { UiIcon } from '../ui-icon/ui-icon';
import { IconValue } from '../../data/icons';

@Component({
  selector: 'ui-toast',
  imports: [UiButton, UiIcon],
  templateUrl: './ui-toast.html',
  styleUrl: './ui-toast.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiToast {
  toastService = inject(ToastService);

  get toast_types(): Record<
    string,
    { type: string; icon: IconValue; background?: string; foreground?: string }
  > {
    return {
      success: {
        type: 'success',
        icon: 'success',
        background: 'bg-success-soft',
        foreground: 'text-success-strong',
      },
      danger: {
        type: 'danger',
        icon: 'danger',
        background: 'bg-danger-soft',
        foreground: 'text-danger-strong',
      },
      info: {
        type: 'info',
        icon: 'info',
        background: 'bg-brand-soft',
        foreground: 'text-fg-brand-strong',
      },
      warning: {
        type: 'warning',
        icon: 'warning',
        background: 'bg-warning-soft',
        foreground: 'text-warning-strong',
      },
    };
  }
}
