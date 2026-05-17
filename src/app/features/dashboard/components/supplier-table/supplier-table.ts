import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { create_table_field, create_text_field } from '@/app/shared/ui/ui-table/ui-table_helper';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiTable } from '@/app/shared/ui/ui-table/ui-table';
import { SupplierService } from '../../services/supplier.service';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';
import { DashboardTableDropdown } from '../dashboard-table-dropdown/dashboard-table-dropdown';
import { UiImage } from '@/app/shared/ui/ui-image/ui-image';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'supplier-table',
  imports: [UiTable],
  providers: [DatePipe],
  templateUrl: './supplier-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierTable {
  supplierService = inject(SupplierService);
  private datePipe = inject(DatePipe);

  fields = [
    create_text_field<SupplierInterface>('ID', (row) => row.id),

    create_table_field<SupplierInterface, UiImage>('Imagen', UiImage, (row) => ({
      url: row.image_url,
      placeholder: 'supplier',
      height: 3,
      is_square: true,
    })),
    create_text_field<SupplierInterface>('Nombre', (row) => row.name),
    create_text_field<SupplierInterface>('Correo Electrónico', (row) => row.email),
    create_text_field<SupplierInterface>('Número de Teléfono', (row) => row.phone_number),
    create_text_field<SupplierInterface>('Fecha de Creación', (row) =>
      this.datePipe.transform(row.created_at, 'short'),
    ),
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
            { label: 'Editar', icon: 'edit', on_click: () => console.log('Editar' + row.id) },
            {
              label: 'Deshabilitar',
              icon: 'arrow_down',
              on_click: () => console.log('Deshabilitar' + row.id),
            },
            { label: 'Eliminar', icon: 'delete', on_click: () => console.log('Eliminar' + row.id) },
          ],
        ],
      }),
    ),
  ];
}
