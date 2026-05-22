import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { CategoryService } from '../../services/category.service';
import { CategoryInterface } from '../../interfaces/category.interface';
import { CategoryForm } from '../category-form/category-form';

@Component({
  selector: 'category-drawer',
  imports: [CategoryForm],
  templateUrl: './category-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDrawer {
  categoryService = inject(CategoryService);
  drawerService = inject(DrawerService);

  template_drawer_create = viewChild.required<TemplateRef<any>>('drawer_create_content');
  template_drawer_update = viewChild.required<TemplateRef<any>>('drawer_update_content');

  category_form_create = viewChild<CategoryForm>('category_form_create');
  category_form_update = viewChild<CategoryForm>('category_form_update');

  open_drawer_create() {
    this.setup_and_open_drawer({
      title: 'Crear categoria',
      category: null,
      template: this.template_drawer_create(),
      on_submit: async () => {
        await this.category_form_create()?.on_submit(new SubmitEvent('submit'));
      },
    });
  }

  open_drawer_update(category: CategoryInterface) {
    this.setup_and_open_drawer({
      title: 'Editar categoria',
      category: category,
      template: this.template_drawer_update(),
      on_submit: async () => {
        await this.category_form_update()?.on_submit(new SubmitEvent('submit'));
      },
    });
  }

  private setup_and_open_drawer(config: {
    title: string;
    category: CategoryInterface | null;
    template: any;
    on_submit: () => Promise<void>;
  }) {
    this.categoryService.selected_category.set(config.category);

    this.drawerService.set_header({
      title: config.title,
      show_close_button: true,
      show_divider: true,
    });

    this.drawerService.set_content(config.template);

    this.drawerService.set_footer([
      {
        label: 'Cerrar',
        variant: 'secondary',
        size: 'sm',
        action: () => {
          this.drawerService.close();
        },
      },
      {
        label: 'Guardar',
        variant: 'success',
        size: 'sm',
        action: async () => {
          await config.on_submit();
          this.drawerService.close();
        },
      },
    ]);

    this.drawerService.open();
  }
}
