import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { ModalService } from '@/app/shared/services/modal.service';
import { ProductService } from '../../services/product.service';
import { ProductInterface } from '../../interfaces/product.interface';

@Component({
  selector: 'product-modal',
  imports: [],
  templateUrl: './product-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductModal {
  productService = inject(ProductService);
  modalService = inject(ModalService);
  template_delete_content = viewChild.required<TemplateRef<any>>('delete_content');
  template_disable_content = viewChild.required<TemplateRef<any>>('disable_content');

  open_delete_modal(product: ProductInterface) {
    this.productService.selected_product.set(product);
    this.modalService.set_header({
      title: 'Eliminar producto',
      show_close_button: true,
    });
    this.modalService.set_content(this.template_delete_content());
    this.modalService.set_footer({
      right_buttons: [
        {
          label: 'Cancelar',
          variant: 'secondary',
          size: 'md',
          action: () => {
            this.modalService.close();
          },
        },
        {
          label: 'Eliminar',
          variant: 'danger',
          size: 'md',
          action: async () => {
            await this.productService.delete(product.id);
            this.modalService.close();
          },
        },
      ],
    });
    this.modalService.open();
  }

  open_disable_modal(product: ProductInterface) {
    this.productService.selected_product.set(product);
    this.modalService.set_header({
      title: `${product.disabled_at ? 'Habilitar' : 'Deshabilitar'} producto`,
      show_close_button: true,
    });
    this.modalService.set_content(this.template_disable_content());
    this.modalService.set_footer({
      right_buttons: [
        {
          label: 'Cancelar',
          variant: 'secondary',
          size: 'md',
          action: () => {
            this.modalService.close();
          },
        },
        {
          label: product.disabled_at ? 'Habilitar' : 'Deshabilitar',
          variant: product.disabled_at ? 'success' : 'danger',
          size: 'md',
          action: async () => {
            await this.productService.disable(product.id);
            this.modalService.close();
          },
        },
      ],
    });
    this.modalService.open();
  }
}
