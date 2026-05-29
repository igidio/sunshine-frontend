import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy } from '@angular/core';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { UserService } from '../../services/user.service';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { menu_items } from '@/app/shared/data/menu';
import { UserTable } from '../../components/user-table/user-table';
import { ToastService } from '@/app/shared/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'user-page',
  standalone: true,
  imports: [UiCard, UserTable],
  templateUrl: './user-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPage implements OnDestroy {
  private router = inject(Router);
  userService = inject(UserService);
  private toastService = inject(ToastService);
  private dashboard = inject(DashboardService);
  private destroy_ref = inject(DestroyRef);

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.user]);
    this.userService.listen_to_query_params(this.destroy_ref);
  }

  ngOnDestroy() {
    this.dashboard.set_tree([]);
  }

  on_reload = async () => {
    await this.userService.get();
    this.toastService.show({
      message: 'Lista de usuarios actualizada',
      type: 'success',
    });
  };

  on_revert = () => {
    this.router.navigate([], {
      queryParams: {},
      replaceUrl: true,
    });
    this.toastService.show({
      message: 'Parámetros y filtros restablecidos',
      type: 'info',
    });
  };
}

export default UserPage;
