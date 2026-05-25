import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiTable } from '@/app/shared/ui/ui-table/ui-table';
import { MovementService } from '../../services/movement.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { create_table_field, create_text_field } from '@/app/shared/ui/ui-table/ui-table_helper';
import { MovementInterface } from '../../interfaces/movement.interface';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';
import { MovementExpandable } from '../movement-expandable/movement-expandable';
import { StockProductFilter } from '../stock-filter/stock-filter';

@Component({
  selector: 'stock-table',
  imports: [UiTable, StockProductFilter],
  templateUrl: './stock-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class StockTable {
  movementService = inject(MovementService);
  datePipe = inject(DatePipe);

  types = {
    purchase: {
      color: 'success',
      label: 'Adquisición',
    },
    expired: {
      color: 'danger',
      label: 'Vencido',
    },
    damaged: {
      color: 'danger',
      label: 'Dañado',
    },
    lost: {
      color: 'danger',
      label: 'Perdido',
    },
    adjustment: {
      color: 'warning',
      label: 'Ajuste',
    },
    internal_use: {
      color: 'warning',
      label: 'Uso Interno',
    },
  };

  expandable = create_table_field<MovementInterface, MovementExpandable>({
    label: 'Información Adicional',
    component: MovementExpandable,
    getInputs: (row: MovementInterface) => ({
      notes: row.notes,
      supplier: row.supplier,
    }),
  });

  fields = [
    create_table_field<MovementInterface, UiBadge>({
      label: 'Tipo',
      component: UiBadge,
      getInputs: (row: MovementInterface) => ({
        _label: this.types[row.type as keyof typeof this.types]?.label || row.type,
        variant: this.types[row.type as keyof typeof this.types]?.color || 'primary',
      }),
    }),
    create_text_field<MovementInterface>({
      label: 'Cantidad',
      name: 'quantity',
      getValue: (row: MovementInterface) => row.quantity,
    }),
    create_text_field<MovementInterface>({
      label: 'Producto',
      name: 'product',
      options: { sortable: true, take_width: true },
      getValue: (row: MovementInterface) => row.product.name,
    }),
    create_text_field<MovementInterface>({
      label: 'Fecha de Creacion',
      name: 'created_at',
      getValue: (row: MovementInterface) => this.datePipe.transform(row.created_at, 'short'),
      options: { sortable: true },
    }),
  ];
}
