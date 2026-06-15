import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoginLogo } from '@/app/features/auth/components/login-logo/login-logo';
import { UiMode } from '@/app/shared/ui/ui-mode/ui-mode';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { UiLogo } from '@/app/shared/ui/ui-logo/ui-logo';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, UiMode, UiIcon, UiLogo, RouterLink],
  templateUrl: './AuthLayout.html',
  styleUrl: './AuthLayout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '(window:scroll)': 'on_scroll()',
  },
})
export default class AuthLayout {
  scrolled = signal(false);
  on_scroll() {
    this.scrolled.set(window.scrollY > 0);
  }
}
