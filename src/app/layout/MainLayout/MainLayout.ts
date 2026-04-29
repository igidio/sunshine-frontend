import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'main-layout',
  imports: [],
  templateUrl: './MainLayout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {}
