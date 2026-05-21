import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { create_table_field, create_text_field } from '@/app/shared/ui/ui-table/ui-table_helper';
import { UiTable } from '@/app/shared/ui/ui-table/ui-table';
import { UiImage } from '@/app/shared/ui/ui-image/ui-image';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { ModalService } from '@/app/shared/services/modal.service';
import { DashboardTableDropdown } from '@/app/features/dashboard/components/dashboard-table-dropdown/dashboard-table-dropdown';
import { environment } from '@/environments/environment.development';
import { ProductService } from '../../services/product.service';
import { ProductModule } from '../../interfaces/product.interface';
import { ProductDrawer } from '../product-drawer/product-drawer';
import { ProductModal } from '../product-modal/product-modal';

@Component({
  selector: 'product-table',
  imports: [UiTable, ProductDrawer, ProductModal, UiButton],
  providers: [DatePipe],
  templateUrl: './product-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTable {
  productService = inject(ProductService);
  private datePipe = inject(DatePipe);
  drawerService = inject(DrawerService);
  modalService = inject(ModalService);

  product_drawer_ref = viewChild<ProductDrawer>('product_drawer');
  product_modal_ref = viewChild<ProductModal>('product_modal');

  private resolve_image_url(product: ProductModule): string | null {
    const image = product.images?.[0];
    const image_url =
      typeof image === 'string' ? image : (image?.url ?? image?.path ?? image?.image_url ?? null);

    return image_url ? environment.imagePrefix + image_url : null;
  }

  fields = [
    create_table_field<ProductModule, UiImage>({
      label: 'Imagen',
      name: 'images',
      component: UiImage,
      getInputs: (row: ProductModule) => ({
        url: this.resolve_image_url(row),
        placeholder: 'image',
        height: 3,
        is_square: true,
      }),
    }),
    create_text_field<ProductModule>({
      label: 'Nombre',
      name: 'name',
      getValue: (row: ProductModule) => row.name,
      options: { sortable: true },
    }),
    create_text_field<ProductModule>({
      label: 'Categoria',
      name: 'category_id',
      getValue: (row: ProductModule) => row.category_id,
    }),
    create_text_field<ProductModule>({
      label: 'Precio',
      name: 'price',
      getValue: (row: ProductModule) => row.price,
      options: { sortable: true },
    }),
    create_text_field<ProductModule>({
      label: 'Stock',
      name: 'stock.quantity' as any,
      getValue: (row: ProductModule) => row.stock?.quantity ?? 0,
      options: { sortable: true },
    }),
    create_text_field<ProductModule>({
      label: 'Fecha de Creacion',
      name: 'created_at',
      getValue: (row: ProductModule) => this.datePipe.transform(row.created_at, 'short'),
      options: { sortable: true },
    }),
    create_table_field<ProductModule, UiBadge>({
      label: 'Estado',
      component: UiBadge,
      getInputs: (row: ProductModule) => ({
        variant: row.disabled_at ? 'danger' : 'success',
        _label: row.disabled_at ? 'Deshabilitado' : 'Activo',
      }),
    }),
    create_table_field<ProductModule, DashboardTableDropdown>({
      label: 'Acciones',
      component: DashboardTableDropdown,
      getInputs: (row: ProductModule) => ({
        identifier: row.id.toString(),
        items: [
          [
            {
              label: 'Editar',
              icon: 'edit',
              on_click: () => this.product_drawer_ref()?.open_drawer_update(row),
            },
            {
              label: row.disabled_at ? 'Habilitar' : 'Deshabilitar',
              icon: row.disabled_at ? 'arrow_up' : 'arrow_down',
              on_click: () => this.product_modal_ref()?.open_disable_modal(row),
            },
            {
              label: 'Eliminar',
              icon: 'delete',
              on_click: () => this.product_modal_ref()?.open_delete_modal(row),
            },
          ],
        ],
      }),
    }),
  ];
}
