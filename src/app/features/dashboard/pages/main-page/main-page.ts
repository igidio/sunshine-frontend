import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'main-page',
  imports: [],
  templateUrl: './main-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainPage {}
