import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-landing-main',
  imports: [],
  templateUrl: './main.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingMain {}
