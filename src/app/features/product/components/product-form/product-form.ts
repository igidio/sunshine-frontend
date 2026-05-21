import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
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
import { ProductModule } from '../../interfaces/product.interface';

@Component({
  selector: 'product-form',
  imports: [UiField, UiInput, UiFile, UiPlaceholder, UiImage, UiButton],
  templateUrl: './product-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm {
  productService = inject(ProductService);
  readonly UiFile = viewChild<UiFile>('file_component');
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

  selected_images = signal<File[]>([]);
  image_error = signal<string>('');
  keep_image = signal(true);
  preview_images = signal<string[]>([]);

  on_image_selected(eventData: File | File[] | FileList | null) {
    if (!eventData) {
      this.selected_images.set([]);
      this.preview_images.set([]);
      return;
    }

    let fileArray: File[];
    if (eventData instanceof FileList) {
      fileArray = Array.from(eventData);
    } else if (Array.isArray(eventData)) {
      fileArray = eventData;
    } else {
      fileArray = [eventData];
    }

    this.selected_images.set(fileArray);

    const urls = fileArray.map((file) => URL.createObjectURL(file));
    this.preview_images.set(urls);
  }

  remove_preview(event: Event, index: number) {
    this.UiFile()?.delete_one(event, index);
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

      images
        ? images.forEach((image) => formData.append('images', image))
        : images === null && this.keep_image() && formData.append('images', 'null');

      await this.productService.create_or_update(formData);
      this.selected_images.set([]);
    });
  }
}
