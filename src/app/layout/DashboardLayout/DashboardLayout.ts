import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ResolveEnd, Router, RouterOutlet } from '@angular/router';
import { DashboardNavbar } from '@/app/features/dashboard/components/dashboard-navbar/dashboard-navbar';
import { DashboardSidebar } from '@/app/features/dashboard/components/dashboard-sidebar/dashboard-sidebar';
import { UiBreadcrumb } from '@/app/shared/ui/ui-breadcrumb/ui-breadcrumb';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { ChatButton } from '@/app/features/chat/components/chat-button/chat-button';
import { ChatWindow } from '@/app/features/chat/components/chat-window/chat-window';
import { ChatService } from '@/app/features/chat/services/chat.service';
import { SseService } from '@/app/core/services/sse.service';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { filter, map } from 'rxjs';
import { AuthService } from '@/app/core/services/auth.service';
import { CardNotVerified } from "@/app/shared/components/card-not_verified/card-not_verified";
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    DashboardNavbar,
    DashboardSidebar,
    UiBreadcrumb,
    ChatButton,
    ChatWindow,
    UiButton,
    CardNotVerified
  ],
  templateUrl: './DashboardLayout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardLayout {
  private sseService = inject(SseService);
  router = inject(Router);
  chatService = inject(ChatService);
  dashboardService = inject(DashboardService);
  collapse_sidebar = signal<boolean>(false);
  authService = inject(AuthService);

  ngOnDestroy() {
    this.sseService.disconnect();
  }

  constructor() {
    this.sseService.connect();
    this.router.events.pipe(filter((event) => event instanceof ResolveEnd)).subscribe(() => {
      this.dashboardService.unset_reload();
    });
  }
}
