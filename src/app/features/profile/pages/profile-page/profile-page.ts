import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { menu_items } from '@/app/shared/data/menu';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UiTabs } from "@/app/shared/ui/ui-tabs/ui-tabs";
import { UiTabComponent } from "@/app/shared/ui/ui-tabs/ui-tab";
import { UiCard } from "@/app/shared/ui/ui-card/ui-card";
import { ProfileForm } from "../../components/profile-form/profile-form";
import { UserForm } from "../../components/user-form/user-form";
import { PasswordForm } from "../../components/password-form/password-form";
import { ChatAccess } from "../../components/chat-access/chat-access";

@Component({
  selector: 'app-profile-page',
  imports: [UiTabs, UiTabComponent, UiCard, ProfileForm, UserForm, PasswordForm, ChatAccess],
  templateUrl: './profile-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfilePage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  dashboard = inject(DashboardService);


  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.profile]);
  }

  myTabs = [
    { id: 'profile', label: 'Perfil' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'settings', label: 'Configuración' },
  ];

}
