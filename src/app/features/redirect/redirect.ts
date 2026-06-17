import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '@/app/shared/services/toast.service';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RedirectPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  authService = inject(AuthService);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const action = params.get('action');
    const token = params.get('token');

    if (action === 'verification' && token) {
      this.handle_verify(token);
    } else {
      this.router.navigate(['/']);
    }
  }

  private async handle_verify(token: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.patch(`/api/confirmation/email/${token}`, {}),
      );
      this.toast.show({
        message: 'Cuenta verificada correctamente',
        type: 'success',
        duration: 4000,
      });
      this.authService.user.update((user) => {
        return user ? { ...user, email_verified_at: new Date() } : null;
      });
    }
    finally {
      this.router.navigate(['/auth/login']);
    }
  }
}
