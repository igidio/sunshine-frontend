import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, viewChild } from '@angular/core';
import {
  create_html_field,
  create_table_field,
  create_text_field,
} from '@/app/shared/ui/ui-table/ui-table_helper';
import { UiTable } from '@/app/shared/ui/ui-table/ui-table';
import { UiImage } from '@/app/shared/ui/ui-image/ui-image';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { ModalService } from '@/app/shared/services/modal.service';
import { DashboardTableDropdown } from '@/app/features/dashboard/components/dashboard-table-dropdown/dashboard-table-dropdown';
import { environment } from '@/environments/environment.development';
import { ProductService } from '../../services/product.service';
import { ProductInterface } from '../../interfaces/product.interface';
import { ProductDrawer } from '../product-drawer/product-drawer';
import { ProductModal } from '../product-modal/product-modal';
import { Router } from '@angular/router';

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
  router = inject(Router);
  private destroyRef = inject(DestroyRef);

  product_drawer_ref = viewChild<ProductDrawer>('product_drawer');
  product_modal_ref = viewChild<ProductModal>('product_modal');

  get can_manage_products() {
    return this.productService.can_manage_products;
  }

  private resolve_image_url(product: ProductInterface): string | null {
    const image = product.images?.[0];
    const image_url =
      typeof image === 'string' ? image : (image?.url ?? image?.path ?? image?.image_url ?? null);

    return image_url ? environment.imagePrefix + image_url : null;
  }

  expandable = create_text_field<ProductInterface>({
    label: 'Descripción',
    name: 'description',
    getValue: (row: ProductInterface) => row.description,
    options: { sortable: true },
  });

  fields = computed(() => {
    const fields = [
      create_table_field<ProductInterface, UiImage>({
        label: 'Imagen',
        name: 'images',
        component: UiImage,
        getInputs: (row: ProductInterface) => ({
          url: this.resolve_image_url(row),
          placeholder: 'image',
          height: 3,
          is_square: true,
        }),
      }),
      create_text_field<ProductInterface>({
        label: 'Nombre',
        name: 'name',
        getValue: (row: ProductInterface) => row.name,
        options: { sortable: true },
      }),
      create_table_field<ProductInterface, UiButton>({
        label: 'Categoria',
        name: 'category',
        component: UiButton,
        getInputs: (row) => ({
          _label: row.category?.name ?? 'Sin categoria',
          variant: 'secondary',
          size: 'sm',
          icon: 'search',
        }),
        onClick: (row: ProductInterface) =>
          this.router.navigate([], {
            queryParams: { search: row.category?.name, table: 'categories' },
            replaceUrl: true,
          }),
      }),
      create_text_field<ProductInterface>({
        label: 'Precio',
        name: 'price',
        getValue: (row: ProductInterface) => row.price,
        options: { sortable: true },
      }),
      create_text_field<ProductInterface>({
        label: 'Stock',
        name: 'stock.quantity' as any,
        getValue: (row: ProductInterface) => row.stock?.quantity ?? 0,
        options: { sortable: true },
      }),
      create_text_field<ProductInterface>({
        label: 'Fecha de Creacion',
        name: 'created_at',
        getValue: (row: ProductInterface) => this.datePipe.transform(row.created_at, 'short'),
        options: { sortable: true },
      }),
      create_table_field<ProductInterface, UiBadge>({
        label: 'Estado',
        component: UiBadge,
        getInputs: (row: ProductInterface) => ({
          variant: row.disabled_at ? 'danger' : 'success',
          _label: row.disabled_at ? 'Deshabilitado' : 'Activo',
        }),
      }),
    ];

    if (this.can_manage_products()) {
      fields.push(
        create_table_field<ProductInterface, DashboardTableDropdown>({
          label: 'Acciones',
          component: DashboardTableDropdown,
          getInputs: (row: ProductInterface) => ({
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
      );
    }

    return fields;
  });

  ngOnInit() {
    this.productService.listen_to_query_params(this.destroyRef);
  }
}
