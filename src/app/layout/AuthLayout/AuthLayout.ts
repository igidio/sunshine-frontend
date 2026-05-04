import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  styles: [
    `
      :host {
        display: block;
        background-color: var(--color-blue-800);
      }
    `,
  ],

  templateUrl: './AuthLayout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthLayout {}
