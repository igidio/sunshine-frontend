import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { create_table_field, create_text_field } from '@/app/shared/ui/ui-table/ui-table_helper';
import { UiTable } from '@/app/shared/ui/ui-table/ui-table';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { DashboardTableDropdown } from '@/app/features/dashboard/components/dashboard-table-dropdown/dashboard-table-dropdown';
import { CategoryService } from '../../services/category.service';
import { CategoryInterface } from '../../interfaces/category.interface';
import { CategoryDrawer } from '../category-drawer/category-drawer';
import { CategoryModal } from '../category-modal/category-modal';

@Component({
  selector: 'category-table',
  imports: [UiTable, CategoryDrawer, CategoryModal, UiButton],
  templateUrl: './category-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryTable {
  categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  category_drawer_ref = viewChild<CategoryDrawer>('category_drawer');
  category_modal_ref = viewChild<CategoryModal>('category_modal');

  view_products(category: CategoryInterface) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { table: 'products', category_id: category.id },
      replaceUrl: true,
    });
  }

  fields = [
    create_text_field<CategoryInterface>({
      label: 'Nombre',
      name: 'name',
      getValue: (row: CategoryInterface) => row.name,
      options: { sortable: true },
    }),
    create_text_field<CategoryInterface>({
      label: 'Descripcion',
      name: 'description',
      getValue: (row: CategoryInterface) => row.description,
    }),
    create_table_field<CategoryInterface, UiButton>({
      label: 'Productos',
      component: UiButton,
      getInputs: () => ({
        _label: 'Ver productos',
        icon: 'search',
        variant: 'secondary',
        size: 'sm',
      }),
      onClick: (row: CategoryInterface) => this.view_products(row),
    }),
    create_table_field<CategoryInterface, DashboardTableDropdown>({
      label: 'Acciones',
      component: DashboardTableDropdown,
      getInputs: (row: CategoryInterface) => ({
        identifier: row.id.toString(),
        items: [
          [
            {
              label: 'Editar',
              icon: 'edit',
              on_click: () => this.category_drawer_ref()?.open_drawer_update(row),
            },
            {
              label: 'Eliminar',
              icon: 'delete',
              on_click: () => this.category_modal_ref()?.open_delete_modal(row),
            },
          ],
        ],
      }),
    }),
  ];
}
