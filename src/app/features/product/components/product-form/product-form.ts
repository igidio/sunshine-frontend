import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { required, form, submit } from '@angular/forms/signals';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { UiPlaceholder } from '@/app/shared/ui/ui-textarea/ui-textarea';
import { UiFile } from '@/app/shared/ui/ui-file/ui-file';
import { UiImage } from '@/app/shared/ui/ui-image/ui-image';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { JsonPipe } from '@angular/common';
import { environment } from '@/environments/environment.development';
import { ProductService } from '../../services/product.service';
import { ProductModule } from '../../interfaces/product.interface';

@Component({
  selector: 'product-form',
  imports: [UiField, UiInput, UiFile, UiPlaceholder, UiImage, UiButton],
  templateUrl: './product-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm {
  productService = inject(ProductService);
  environment = environment;

  constructor() {
    effect(() => {
      const product = this.productService.selected_product();
      this.keep_image.set(true);
      if (product) {
        this.model.set({
          name: product.name || '',
          description: product.description || '',
          price: product.price || 0,
          category_id: product.category_id || 0,
          stock_quantity: product.stock?.quantity || 0,
        });
      }
    });
  }

  model = signal({
    name: '',
    description: '',
    price: 0,
    category_id: 0,
    stock_quantity: 0,
  });

  form = form(this.model, (schema_path) => {
    required(schema_path.name, {
      message: 'El nombre del producto es requerido',
    });
    required(schema_path.price, {
      message: 'El precio es requerido',
    });
    required(schema_path.category_id, {
      message: 'La categoria es requerida',
    });
    required(schema_path.stock_quantity, {
      message: 'El stock es requerido',
    });
  });

  selected_image = signal<File | null>(null);
  image_error = signal<string>('');
  keep_image = signal(true);

  on_image_selected(file: File | null) {
    this.selected_image.set(file);
  }

  on_image_error(error: string) {
    this.image_error.set(error);
  }

  resolve_image_url(product: ProductModule | null): string | null {
    const image = product?.images?.[0];
    const image_url =
      typeof image === 'string' ? image : (image?.url ?? image?.path ?? image?.image_url ?? null);

    return image_url ? this.environment.imagePrefix + image_url : null;
  }

  async on_submit(event: SubmitEvent) {
    event.preventDefault();

    await submit(this.form, async (form) => {
      const formData = new FormData();
      formData.append('name', form().value().name);
      formData.append('description', form().value().description);
      formData.append('price', form().value().price.toString());
      formData.append('category_id', form().value().category_id.toString());
      //formData.append('stock_quantity', form().value().stock_quantity.toString());

      const image = this.selected_image();

      image
        ? formData.append('image', image)
        : image === null && this.keep_image() && formData.append('image', 'null');

      await this.productService.create_or_update(formData);
      this.selected_image.set(null);
    });
  }
}
