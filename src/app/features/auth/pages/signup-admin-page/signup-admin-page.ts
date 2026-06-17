import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SignupForm } from '../../components/signup-form/signup-form';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { UiAlert } from '@/app/shared/ui/ui-alert/ui-alert';
import { ToastService } from '@/app/shared/services/toast.service';
import { roles_labeled, UserRole } from '@/app/features/user/interfaces/user.interface';

interface InviteVerificationResponse {
  email: string;
  role: 'admin' | 'employer';
}

@Component({
  selector: 'signup-admin-page',
  imports: [SignupForm, UiCard, UiAlert],
  templateUrl: './signup-admin-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignupAdminPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  token = signal<string | undefined>(undefined);
  invite_email = signal<string | null>(null);
  invite_role = signal<UserRole | null>(null);
  role_label = signal<string>('');

  is_validating = signal(true);
  is_valid = signal(false);

  async ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      this.toast.show({
        message: 'Enlace de invitación no válido',
        type: 'danger',
        duration: 4000,
      });
      this.router.navigate(['/auth/login']);
      return;
    }

    try {
      const response = await firstValueFrom(
        this.http.get<InviteVerificationResponse>(`/api/confirmation/${token}`),
      );

      if (!response || !response.email || !response.role || !['admin', 'employer'].includes(response.role)) {
        throw new Error('Invalid response shape');
      }

      this.token.set(token);
      this.invite_email.set(response.email);
      this.invite_role.set(response.role as UserRole);
      this.role_label.set(roles_labeled[response.role as keyof typeof roles_labeled] ?? response.role);
      this.is_valid.set(true);
    } catch {
      this.router.navigate(['/auth/login']);
    } finally {
      this.is_validating.set(false);
    }
  }
}
