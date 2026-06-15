import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { menu_items } from '@/app/shared/data/menu';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  imports: [],
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

}
