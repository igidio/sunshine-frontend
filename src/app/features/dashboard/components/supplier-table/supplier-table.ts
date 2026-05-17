import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { create_table_field, create_text_field } from '@/app/shared/ui/ui-table/ui-table_helper';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiTable } from '@/app/shared/ui/ui-table/ui-table';
import { SupplierService } from '../../services/supplier.service';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';
import { DashboardTableDropdown } from '../dashboard-table-dropdown/dashboard-table-dropdown';

@Component({
  selector: 'supplier-table',
  imports: [UiTable],
  templateUrl: './supplier-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierTable {
  supplierService = inject(SupplierService);

  fields = [
    create_text_field<SupplierInterface>('ID', (row) => row.id),
    create_text_field<SupplierInterface>('Nombre', (row) => row.name),
    create_text_field<SupplierInterface>('Correo Electrónico', (row) => row.email),
    create_text_field<SupplierInterface>('Número de Teléfono', (row) => row.phone_number),
    create_table_field<SupplierInterface, UiBadge>('Estado', UiBadge, (row) => ({
      variant: row.disabled_at ? 'danger' : 'success',
      _label: row.disabled_at ? 'Deshabilitado' : 'Activo',
    })),
    create_table_field<SupplierInterface, DashboardTableDropdown>(
      'Acciones',
      DashboardTableDropdown,
      (row) => ({
        identifier: row.id.toString(),
        items: [
          [
            { label: 'Editar', on_click: () => console.log('Editar' + row.id) },
            { label: 'Deshabilitar', on_click: () => console.log('Deshabilitar' + row.id) },
            { label: 'Eliminar', on_click: () => console.log('Eliminar' + row.id) },
          ],
        ],
      }),
    ),
  ];
}
