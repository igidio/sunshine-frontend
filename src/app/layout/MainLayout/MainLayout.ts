import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainHeader } from '../../features/landing/components/main-header/main-header';
import { MainFooter } from '../../features/landing/components/main-footer/main-footer';

@Component({
  selector: 'main-layout',
  imports: [RouterOutlet, MainHeader, MainFooter],
  templateUrl: './MainLayout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {

}
