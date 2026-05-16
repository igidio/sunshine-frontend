import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import { NavigationEnd, ResolveEnd, Router, RouterOutlet } from '@angular/router';
import { DashboardNavbar } from '@/app/features/dashboard/components/dashboard-navbar/dashboard-navbar';
import { DashboardSidebar } from '@/app/features/dashboard/components/dashboard-sidebar/dashboard-sidebar';
import { UiBreadcrumb } from '@/app/shared/ui/ui-breadcrumb/ui-breadcrumb';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { ChatButton } from '@/app/features/chat/components/chat-button/chat-button';
import { ChatWindow } from '@/app/features/chat/components/chat-window/chat-window';
import { ChatService } from '@/app/features/chat/services/chat.service';
import { SseService } from '@/app/core/services/sse.service';
import { AuthService } from '@/app/core/services/auth.service';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { filter } from 'rxjs';

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
  ],
  templateUrl: './DashboardLayout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardLayout {
  private sseService = inject(SseService);
  private authService = inject(AuthService);
  router = inject(Router);
  chatService = inject(ChatService);
  dashboardService = inject(DashboardService);
  collapse_sidebar = signal<boolean>(false);

  ngOnInit() {
    this.authService.check_auth();
    this.sseService.connect();
  }

  ngOnDestroy() {
    this.sseService.disconnect();
  }

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof ResolveEnd)).subscribe(() => {
      this.dashboardService.unset_reload();
    });
  }
}
