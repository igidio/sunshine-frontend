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
import { SelectMenuOption, UiSelectMenu } from '@/app/shared/ui/ui-select-menu/ui-select-menu';
import { firstValueFrom } from 'rxjs';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { CategoryInterface } from '../../interfaces/category.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'product-form',
  imports: [UiField, UiInput, UiFile, UiPlaceholder, UiImage, UiButton, UiSelectMenu],
  templateUrl: './product-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm {
  http = inject(HttpClient);
  productService = inject(ProductService);
  readonly UiFile = viewChild<UiFile>('file_component');
  environment = environment;
  images_to_remove = signal<number[]>([]);
  selected_images = model<File[] | null>(null);

  statusValue = signal<string | number | null>(null);

  constructor() {
    effect(() => {
      const product = this.productService.selected_product();
      this.keep_image.set(true);
      if (product) {
        this.model.set({
          name: product.name || '',
          description: product.description || '',
          price: product.price || 0,
          category: product.category || null,
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

  model = signal<{
    name: string;
    description: string;
    price: number;
    category: CategoryInterface | null;
    stock_quantity: number;
  }>({
    name: '',
    description: '',
    price: 0,
    category: null,
    stock_quantity: 0,
  });

  form = form(this.model, (schema_path) => {
    required(schema_path.name, {
      message: 'El nombre del producto es requerido',
    });
    required(schema_path.category, {
      message: 'La categoria del producto es requerida',
    });
    required(schema_path.price, {
      message: 'El precio es requerido',
    });
    required(schema_path.stock_quantity, {
      message: 'El stock es requerido',
    });
    required(schema_path.description, {
      message: 'La descripcion es requerida',
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

  async get_category_values(search: string = ''): Promise<SelectMenuOption[]> {
    const categories = await firstValueFrom(
      this.http.get<PaginationResponseInterface<CategoryInterface>>('/api/category', {
        params: {
          search,
        },
      }),
    );

    return categories.data.map<SelectMenuOption>((category) => ({
      name: category.name,
      label: category.name,
      value: category,
    }));
  }

  selected_product_option = computed(() => {
    if (!this.productService.selected_product()) {
      return [];
    }
    return [
      {
        name: this.productService.selected_product()!.category?.name || '',
        label: this.productService.selected_product()!.category?.name || '',
        value: this.productService.selected_product()!.category || null,
      },
    ];
  });

  async on_submit(event: SubmitEvent) {
    event.preventDefault();

    return await submit(this.form, async (form) => {
      const formData = new FormData();
      formData.append('name', form().value().name);
      formData.append('description', form().value().description);
      formData.append('price', form().value().price.toString());
      formData.append('category_id', form().value().category?.id.toString() || '');

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
