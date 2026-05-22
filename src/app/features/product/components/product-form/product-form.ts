import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
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
import { ProductInterface } from '../../interfaces/product.interface';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';

@Component({
  selector: 'product-form',
  imports: [UiField, UiInput, UiFile, UiPlaceholder, UiImage, UiButton, UiIcon, JsonPipe],
  templateUrl: './product-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm {
  productService = inject(ProductService);
  readonly UiFile = viewChild<UiFile>('file_component');
  environment = environment;
  images_to_remove = signal<number[]>([]);
  selected_images = model<File[] | null>(null);

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
        this.images_to_remove.set([]);
      }
    });

    effect(() => {
      const files = this.selected_images();

      this.preview_urls.forEach((url) => URL.revokeObjectURL(url));
      this.preview_urls = [];

      if (!files || files.length === 0) {
        this.preview_images.set([]);
        return;
      }

      const urls = files.map((file) => URL.createObjectURL(file));
      this.preview_urls = urls;
      this.preview_images.set(urls);
    });
  }

  max_to_upload = computed(() => {
    return (
      5 -
      (this.selected_images()?.length || 0) -
      (this.productService.selected_product()?.images.length || 0) +
      this.images_to_remove().length
    );
  });

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

  image_error = signal<string>('');
  keep_image = signal(true);
  preview_images = signal<string[]>([]);
  private preview_urls: string[] = [];

  remove_preview(event: Event, index: number) {
    this.UiFile()?.delete_one(event, index);
  }

  remove_existing_image(id: number) {
    this.images_to_remove.update((ids) => [...ids, id]);
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

      const images = this.selected_images();

      images && images.forEach((image) => formData.append('images', image));

      const to_remove = this.images_to_remove();

      to_remove.forEach((id) => {
        formData.append('images_to_remove', id.toString());
      });

      await this.productService.create_or_update(formData);
      this.selected_images.set(null);
      this.images_to_remove.set([]);
    });
  }
}
