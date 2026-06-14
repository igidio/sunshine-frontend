import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class LandingService {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly open_login_modal = signal(0);

  navigate_protected(route: string) {
    if (this.authService.get_access_token()) {
      this.router.navigate([route]);
    } else {
      this.open_login_modal.update((c) => c + 1);
    }
  }
}
