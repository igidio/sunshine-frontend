import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { ProductService } from '../../services/product.service';
import { ProductInterface } from '../../interfaces/product.interface';
import { ProductForm } from '../product-form/product-form';

@Component({
  selector: 'product-drawer',
  imports: [ProductForm],
  templateUrl: './product-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDrawer {
  productService = inject(ProductService);
  drawerService = inject(DrawerService);

  template_drawer_create = viewChild.required<TemplateRef<any>>('drawer_create_content');
  template_drawer_update = viewChild.required<TemplateRef<any>>('drawer_update_content');

  product_form_create = viewChild<ProductForm>('product_form_create');
  product_form_update = viewChild<ProductForm>('product_form_update');

  open_drawer_create() {
    this.setup_and_open_drawer({
      title: 'Crear producto',
      product: null,
      template: this.template_drawer_create(),
      on_submit: async () => {
        await this.product_form_create()?.on_submit(new SubmitEvent('submit'));
      },
    });
  }

  open_drawer_update(product: ProductInterface) {
    this.setup_and_open_drawer({
      title: 'Editar producto',
      product: product,
      template: this.template_drawer_update(),
      on_submit: async () => {
        await this.product_form_update()?.on_submit(new SubmitEvent('submit'));
      },
    });
  }

  private setup_and_open_drawer(config: {
    title: string;
    product: ProductInterface | null;
    template: any;
    on_submit: () => Promise<void>;
  }) {
    this.productService.selected_product.set(config.product);

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
