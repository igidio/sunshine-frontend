import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { FilterBy, UiTable } from '@/app/shared/ui/ui-table/ui-table';
import { MovementService } from '../../services/movement.service';
import { DatePipe } from '@angular/common';
import { create_table_field, create_text_field } from '@/app/shared/ui/ui-table/ui-table_helper';
import { MovementInterface } from '../../interfaces/movement.interface';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';
import { MovementExpandable } from '../movement-expandable/movement-expandable';
import { StockProductFilter } from '../stock-filter/stock-filter';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { MovementModal } from '../movement-modal/movement-modal';
import { movement_types, movement_types_array } from '../../data/stock.data';

@Component({
  selector: 'stock-table',
  imports: [UiTable, StockProductFilter, MovementModal, UiButton],
  templateUrl: './stock-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class StockTable {
  movementService = inject(MovementService);
  datePipe = inject(DatePipe);

  movement_modal_ref = viewChild<MovementModal>('movement_modal');

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
      options: { sortable: true },
      getInputs: (row: MovementInterface) => {
        const movementType = movement_types[row.type];

        return {
          _label: movementType?.label || row.type,
          variant: movementType?.color || 'primary',
        };
      },
    }),
    create_text_field<MovementInterface>({
      label: 'Cantidad',
      name: 'quantity',
      options: { sortable: true },
      getValue: (row: MovementInterface) => row.quantity,
    }),
    create_text_field<MovementInterface>({
      label: 'Producto',
      name: 'stock_id',
      options: { sortable: true, take_width: true },
      getValue: (row: MovementInterface) => row.product.name,
    }),
    create_text_field<MovementInterface>({
      label: 'Fecha de Creación',
      name: 'created_at',
      getValue: (row: MovementInterface) => this.datePipe.transform(row.created_at, 'short'),
      options: { sortable: true },
    }),
  ];

  filters: FilterBy[] = [
    {
      name: 'type',
      label: 'Tipo de movimiento',
      show_value_on_badge: true,
      options: [
        movement_types_array.map((movement_type) => ({
          label: movement_type.label,
          value: movement_type.value,
        })) as { label: string; value: any }[],
      ].flat(),
    },
  ];
}
