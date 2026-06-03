import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SaleFieldClient } from "../sale-field-client/sale-field-client";
import { SaleFieldProduct } from "../sale-field-product/sale-field-product";
import { SaleFieldAppointment } from "../sale-field-appointment/sale-field-appointment";
import { SaleCreateService } from '../../services/sale-create.service';


@Component({
  selector: 'sale-create',
  imports: [SaleFieldClient, SaleFieldProduct, SaleFieldAppointment],
  templateUrl: './sale-create.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleCreate {
  saleCreateService = inject(SaleCreateService);
}
