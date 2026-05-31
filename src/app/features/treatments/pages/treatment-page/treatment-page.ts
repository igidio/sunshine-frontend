import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { menu_items } from '@/app/shared/data/menu';
import { ToastService } from '@/app/shared/services/toast.service';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';
import { DashboardService } from '@/app/features/dashboard/services/dashboard.service';
import { TreatmentService } from '../../services/treatment.service';
import { TreatmentTable } from '../../components/treatment-table/treatment-table';

@Component({
  selector: 'treatment-page',
  imports: [UiCard, TreatmentTable],
  templateUrl: './treatment-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TreatmentPage implements OnInit {
  treatmentService = inject(TreatmentService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  dashboard = inject(DashboardService);
  destroyRef = inject(DestroyRef);

  constructor() {
    this.dashboard.set_tree([menu_items.home, menu_items.treatment]);
  }

  ngOnInit() {
    this.treatmentService.listen_to_query_params(this.destroyRef);
  }

  on_reload = async () => {
    await this.treatmentService.get();
    this.toastService.show({
      message: 'Lista de servicios actualizada',
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
