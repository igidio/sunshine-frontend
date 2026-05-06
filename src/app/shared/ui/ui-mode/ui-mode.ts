import { ChangeDetectionStrategy, Component, DOCUMENT, inject, signal } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';
import { ModeService } from '../../services/mode.service';

@Component({
  selector: 'ui-mode',
  imports: [UiIcon],
  templateUrl: './ui-mode.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiMode {
  theme_service = inject(ModeService);
}
