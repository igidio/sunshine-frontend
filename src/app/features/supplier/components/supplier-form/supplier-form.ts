import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { email, form, required, submit } from '@angular/forms/signals';
import { UiFile } from '@/app/shared/ui/ui-file/ui-file';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UiPlaceholder } from '@/app/shared/ui/ui-textarea/ui-textarea';

@Component({
  selector: 'supplier-form',
  imports: [UiField, UiInput, UiFile, UiPlaceholder],
  templateUrl: './supplier-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierForm {
  http = inject(HttpClient);

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

  on_image_selected(file: File | null) {
    this.selected_image.set(file);
  }

  on_image_error(error: string) {
    this.image_error.set(error);
  }

  protected on_submit(event: SubmitEvent) {
    event.preventDefault();

    submit(this.form, async (form) => {
      const formData = new FormData();
      formData.append('name', form().value().name);
      formData.append('email', form().value().email);
      formData.append('phone_number', form().value().phone_number);
      formData.append('address', form().value().address);
      formData.append('description', form().value().description);
      const image = this.selected_image();

      if (image) {
        formData.append('image', image);
      }

      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      firstValueFrom(this.http.post('/api/supplier', formData))
        .then((response) => {
          console.log('Proveedor creado:', response);
        })
        .catch((error) => {
          console.error('Error al crear el proveedor:', error);
        });
    });
  }
}
