import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiSelectMenu } from "@/app/shared/ui/ui-select-menu/ui-select-menu";
import { SaleCreateService } from '../../services/sale-create.service';
import { UiButton } from "@/app/shared/ui/ui-button/ui-button";

@Component({
  selector: 'sale-field-appointment',
  imports: [UiSelectMenu, UiButton],
  templateUrl: './sale-field-appointment.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleFieldAppointment {
  saleCreateService = inject(SaleCreateService);
}
