import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-toast',
  imports: [],
  templateUrl: './ui-toast.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiToast {}
