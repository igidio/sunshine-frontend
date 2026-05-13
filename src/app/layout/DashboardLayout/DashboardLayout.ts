import { ChangeDetectionStrategy, Component, inject, input, model, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DashboardNavbar } from '@/app/features/dashboard/components/dashboard-navbar/dashboard-navbar';
import { DashboardSidebar } from '@/app/features/dashboard/components/dashboard-sidebar/dashboard-sidebar';
import { UiBreadcrumb } from '@/app/shared/ui/ui-breadcrumb/ui-breadcrumb';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { ChatButton } from '@/app/features/chat/components/chat-button/chat-button';
import { ChatWindow } from '@/app/features/chat/components/chat-window/chat-window';
import { ChatService } from '@/app/features/chat/services/chat.service';
import { SseService } from '@/app/core/services/sse.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, DashboardNavbar, DashboardSidebar, UiBreadcrumb, ChatButton, ChatWindow],
  templateUrl: './DashboardLayout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardLayout {
  private sseService = inject(SseService);
  router = inject(Router);
  chatService = inject(ChatService);
  dashboard = inject(DashboardService);
  collapse_sidebar = signal<boolean>(false);

  ngOnInit() {
    this.sseService.connect();
  }

  ngOnDestroy() {
    this.sseService.disconnect();
  }
}
