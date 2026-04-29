import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './AuthLayout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthLayout {}
