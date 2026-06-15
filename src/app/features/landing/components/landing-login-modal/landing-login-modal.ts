import { ChangeDetectionStrategy, Component, effect, inject, TemplateRef, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '@/app/shared/services/modal.service';
import { LoginForm } from '../../../auth/components/login-form/login-form';
import { LandingService } from '../../services/landing.service';

@Component({
  selector: 'landing-login-modal',
  imports: [LoginForm],
  templateUrl: './landing-login-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingLoginModal {
  private modalService = inject(ModalService);
  private landingService = inject(LandingService);
  private router = inject(Router);

  readonly loginContent = viewChild.required<TemplateRef<any>>('login_content');

  constructor() {
    let initialized = false;

    effect(() => {
      this.landingService.open_login_modal();
      if (initialized) {
        this.open();
      }
      initialized = true;
    });
  }

  open() {
    this.modalService.set_content(this.loginContent());
    this.modalService.open({ close_on_navigation: true });
  }
}
