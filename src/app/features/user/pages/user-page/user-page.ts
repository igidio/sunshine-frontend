import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy } from '@angular/core';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { UserService } from '../../services/user.service';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { menu_items } from '@/app/shared/data/menu';
import { UserTable } from '../../components/user-table/user-table';

@Component({
  selector: 'user-page',
  standalone: true,
  imports: [UiCard, UserTable],
  templateUrl: './user-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPage implements OnDestroy {
  userService = inject(UserService);
  private dashboard = inject(DashboardService);
  private destroy_ref = inject(DestroyRef);

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.user]);
    this.userService.listen_to_query_params(this.destroy_ref);
  }

  ngOnDestroy() {
    this.dashboard.set_tree([]);
  }

  on_reload = () => {
    this.userService.get(this.userService['route'].snapshot.queryParams);
  };

  on_revert = () => {
    this.userService.get();
  };
}

export default UserPage;
