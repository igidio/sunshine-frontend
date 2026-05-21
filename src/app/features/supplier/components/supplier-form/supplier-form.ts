import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { email, form, required, submit } from '@angular/forms/signals';
import { UiFile } from '@/app/shared/ui/ui-file/ui-file';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UiPlaceholder } from '@/app/shared/ui/ui-textarea/ui-textarea';
import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { SupplierService } from '../../services/supplier.service';
import { JsonPipe } from '@angular/common';
import { UiImage } from '@/app/shared/ui/ui-image/ui-image';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'supplier-form',
  imports: [UiField, UiInput, UiFile, UiPlaceholder, UiImage, UiButton],
  templateUrl: './supplier-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierForm {
  http = inject(HttpClient);
  supplierService = inject(SupplierService);
  environment = environment;

  constructor() {
    effect(() => {
      const supplier = this.supplierService.selected_supplier();
      this.keep_image.set(true);
      if (supplier) {
        this.model.set({
          name: supplier.name || '',
          email: supplier.email || '',
          phone_number: supplier.phone_number || '',
          address: supplier.address || '',
          description: supplier.description || '',
        });
      }
    });
  }

  model = signal({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    description: '',
  });

  form = form(this.model, (schema_path) => {
    required(schema_path.name, {
      message: 'El nombre del proveedor es requerido',
    });
    required(schema_path.email, {
      message: 'El correo electrónico es requerido',
    });
    email(schema_path.email, {
      message: 'Formato de correo electrónico inválido',
    });
    required(schema_path.phone_number, {
      message: 'El número de teléfono es requerido',
    });
    required(schema_path.address, {
      message: 'La dirección es requerida',
    });
  });

  selected_image = signal<File | null>(null);
  image_error = signal<string>('');
  keep_image = signal(true);

  on_image_selected(file: File[] | null) {
    this.selected_image.set(file?.[0] ?? null);
  }

  on_image_error(error: string) {
    this.image_error.set(error);
  }

  set_model_values(supplier: SupplierInterface | null) {
    this.model.set({
      name: supplier?.name || '',
      email: supplier?.email || '',
      phone_number: supplier?.phone_number || '',
      address: supplier?.address || '',
      description: supplier?.description || '',
    });
  }

  async on_submit(event: SubmitEvent) {
    event.preventDefault();

    await submit(this.form, async (form) => {
      const formData = new FormData();
      formData.append('name', form().value().name);
      formData.append('email', form().value().email);
      formData.append('phone_number', form().value().phone_number);
      formData.append('address', form().value().address);
      formData.append('description', form().value().description);
      const image = this.selected_image();

      console.log(this.selected_image());

      image
        ? formData.append('image', image)
        : image === null && this.keep_image() && formData.append('image', 'null');

      await this.supplierService.create_or_update(formData);
      this.selected_image.set(null);
    });
  }
}
