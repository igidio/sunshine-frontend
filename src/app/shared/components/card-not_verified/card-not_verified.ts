import { AuthService } from '@/app/core/services/auth.service';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { UiCard } from "../../ui/ui-card/ui-card";
import { UiButton } from "../../ui/ui-button/ui-button";
import { Router } from '@angular/router';

@Component({
  selector: 'card-not-verified',
  imports: [UiCard, UiButton],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './card-not_verified.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardNotVerified {
  authService = inject(AuthService);
  router = inject(Router);
}
