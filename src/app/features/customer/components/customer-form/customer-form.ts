import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { maxLength, pattern, required, form, submit } from '@angular/forms/signals';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { UiDatepicker } from '@/app/shared/ui/ui-datepicker/ui-datepicker';
import { CustomerService, CustomerPayload } from '../../services/customer.service';
import { DateTime } from 'luxon';
import { JsonPipe } from '@angular/common';
import { regex } from '@/app/shared/data/regex';

@Component({
  selector: 'customer-form',
  imports: [UiField, UiInput, UiDatepicker],
  templateUrl: './customer-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerForm {
  customerService = inject(CustomerService);
  min_date = DateTime.now().minus({ years: 120 }).toFormat('yyyy-MM-dd');
  max_date = DateTime.now().minus({ years: 18 }).toFormat('yyyy-MM-dd');

  model = signal<CustomerPayload>({
    first_name: '',
    last_name: '',
    birth_date: '',
    address: '',
    phone_number: '',
  });

  constructor() {
    effect(() => {
      const customer = this.customerService.selected_customer();

      if (customer) {
        const birth_date = DateTime.fromJSDate(new Date(customer.profile.birth_date)).toFormat(
          'yyyy-MM-dd',
        );

        this.model.set({
          first_name: customer.profile.first_name || '',
          last_name: customer.profile.last_name || '',
          birth_date: birth_date || '',
          address: customer.profile.address || '',
          phone_number: customer.phone_number || '',
        });
        return;
      }

      this.model.set({
        first_name: '',
        last_name: '',
        birth_date: '',
        address: '',
        phone_number: '',
      });
    });
  }

  form = form(this.model, (schema_path) => {
    required(schema_path.first_name, {
      message: 'El nombre es requerido',
    });
    maxLength(schema_path.first_name, 60, {
      message: 'El nombre no puede superar los 60 caracteres',
    });
    required(schema_path.last_name, {
      message: 'El apellido es requerido',
    });
    maxLength(schema_path.last_name, 60, {
      message: 'El apellido no puede superar los 60 caracteres',
    });
    required(schema_path.birth_date, {
      message: 'La fecha de nacimiento es requerida',
    });
    maxLength(schema_path.birth_date, 60, {
      message: 'La fecha de nacimiento no puede superar los 60 caracteres',
    });
    pattern(schema_path.birth_date, regex.birth_date, {
      message: 'Formato de fecha inválido',
    });
    required(schema_path.address, {
      message: 'La dirección es requerida',
    });
    maxLength(schema_path.address, 60, {
      message: 'La dirección no puede superar los 60 caracteres',
    });
    required(schema_path.phone_number, {
      message: 'El número de teléfono es requerido',
    });
    maxLength(schema_path.phone_number, 10, {
      message: 'El número de teléfono no puede superar los 10 caracteres',
    });
    pattern(schema_path.phone_number, regex.phone_number, {
      message: 'El número de teléfono solo puede contener números',
    });
  });

  on_birth_date_change(value: string | null) {
    this.model.update((current) => ({
      ...current,
      birth_date: value ?? '',
    }));
  }

  async on_submit(event: SubmitEvent) {
    event.preventDefault();

    return await submit(this.form, async (form) => {
      await this.customerService.create_or_update(form().value());
    });
  }
}
