import { ChangeDetectionStrategy, Component, DOCUMENT, inject, signal } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';
import { ModeService } from '../../services/mode.service';
import { UiButton } from '../ui-button/ui-button';

@Component({
  selector: 'ui-mode',
  imports: [UiIcon, UiButton],
  templateUrl: './ui-mode.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiMode {
  theme_service = inject(ModeService);
}
