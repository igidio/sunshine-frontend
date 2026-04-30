import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-logo',
  imports: [],
  templateUrl: './ui-logo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLogo {}
