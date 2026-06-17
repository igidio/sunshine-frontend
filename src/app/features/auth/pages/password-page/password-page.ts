import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PasswordForm } from '../../components/password-form/password-form';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { ToastService } from '@/app/shared/services/toast.service';

@Component({
  selector: 'password-page',
  imports: [PasswordForm, UiCard],
  templateUrl: './password-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PasswordPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  token = signal<string | null>(null);
  is_validating = signal(true);
  is_valid = signal(false);

  async ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      this.toast.show({
        message: 'Enlace de restablecimiento no válido',
        type: 'danger',
        duration: 4000,
      });
      this.router.navigate(['/auth/login']);
      return;
    }

    try {
      await firstValueFrom(
        this.http.get(`/api/confirmation/password/${token}`),
      );
      this.token.set(token);
      this.is_valid.set(true);
    } catch {
      this.router.navigate(['/auth/login']);
    } finally {
      this.is_validating.set(false);
    }
  }
}
