import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { form, maxLength, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiDatepicker } from '@/app/shared/ui/ui-datepicker/ui-datepicker';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { SelectMenuOption, UiSelectMenu } from '@/app/shared/ui/ui-select-menu/ui-select-menu';
import { UiPlaceholder } from '@/app/shared/ui/ui-textarea/ui-textarea';
import { CustomerInterface } from '@/app/features/customer/interfaces/customer.interface';
import { TreatmentInterface } from '@/app/features/treatments/interfaces/treatment.interface';
import { AppointmentService, AppointmentPayload } from '../../services/appointment.service';

interface AppointmentFormValue {
  date: string;
  time_start: string;
  time_end: string;
  customer: CustomerInterface | null;
  treatment: TreatmentInterface | null;
  notes: string;
}

@Component({
  selector: 'appointment-form',
  imports: [UiField, UiDatepicker, UiInput, UiSelectMenu, UiPlaceholder],
  templateUrl: './appointment-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentForm {
  http = inject(HttpClient);
  appointmentService = inject(AppointmentService);

  model = signal<AppointmentFormValue>({
    date: '',
    time_start: '',
    time_end: '',
    customer: null,
    treatment: null,
    notes: '',
  });

  constructor() {
    effect(() => {
      const appointment = this.appointmentService.selected_appointment();

      if (appointment) {
        this.model.set({
          date: this.normalize_date(appointment.date),
          time_start: appointment.time_start || '',
          time_end: appointment.time_end || '',
          customer: appointment.customer || null,
          treatment: appointment.treatment || null,
          notes: appointment.notes || '',
        });
        return;
      }

      this.model.set({
        date: '',
        time_start: '',
        time_end: '',
        customer: null,
        treatment: null,
        notes: '',
      });
    });
  }

  form = form(this.model, (schema_path) => {
    required(schema_path.date, {
      message: 'La fecha es requerida',
    });
    required(schema_path.time_start, {
      message: 'La hora de inicio es requerida',
    });
    required(schema_path.time_end, {
      message: 'La hora de fin es requerida',
    });
    required(schema_path.customer, {
      message: 'El cliente es requerido',
    });
    required(schema_path.treatment, {
      message: 'El servicio es requerido',
    });
    maxLength(schema_path.notes, 1000, {
      message: 'Las notas no pueden superar los 1000 caracteres',
    });
  });

  selected_customer_option = computed<SelectMenuOption[]>(() => {
    const customer = this.appointmentService.selected_appointment()?.customer;

    if (!customer) {
      return [];
    }

    const label = this.get_customer_label(customer);

    return [
      {
        name: label,
        label,
        value: customer,
      },
    ];
  });

  selected_treatment_option = computed<SelectMenuOption[]>(() => {
    const treatment = this.appointmentService.selected_appointment()?.treatment;

    if (!treatment) {
      return [];
    }

    return [
      {
        name: treatment.name,
        label: treatment.name,
        value: treatment,
      },
    ];
  });

  on_date_change(value: string | null) {
    this.model.update((current) => ({
      ...current,
      date: value ?? '',
    }));
  }

  async get_customer_values(search: string = ''): Promise<SelectMenuOption[]> {
    const response = await firstValueFrom(
      this.http.get<PaginationResponseInterface<CustomerInterface>>('/api/customer', {
        params: {
          search,
        },
      }),
    );

    return response.data.map<SelectMenuOption>((customer) => {
      const label = this.get_customer_label(customer);

      return {
        name: label,
        label,
        value: customer,
      };
    });
  }

  async get_treatment_values(search: string = ''): Promise<SelectMenuOption[]> {
    const response = await firstValueFrom(
      this.http.get<PaginationResponseInterface<TreatmentInterface>>('/api/treatment', {
        params: {
          search,
        },
      }),
    );

    return response.data.map<SelectMenuOption>((treatment) => ({
      name: treatment.name,
      label: treatment.name,
      value: treatment,
    }));
  }

  async on_submit(event: SubmitEvent) {
    event.preventDefault();

    return await submit(this.form, async (form) => {
      const value = form().value();

      if (!value.customer || !value.treatment) {
        return {
          kind: 'invalid_form_value',
          message: 'Debe seleccionar cliente y servicio',
        };
      }

      const payload: AppointmentPayload = {
        date: value.date,
        time_start: value.time_start,
        time_end: value.time_end,
        customer_id: value.customer.id,
        treatment_id: value.treatment.id,
        notes: value.notes,
      };

      if (this.appointmentService.selected_appointment()) {
        return await this.appointmentService.update(payload);
      }

      return await this.appointmentService.create(payload);
    });
  }

  private normalize_date(value: string | Date): string {
    if (typeof value === 'string') {
      const parsed = DateTime.fromISO(value);
      return parsed.isValid ? parsed.toFormat('yyyy-MM-dd') : value;
    }

    const parsed = DateTime.fromJSDate(new Date(value));
    return parsed.isValid ? parsed.toFormat('yyyy-MM-dd') : '';
  }

  private get_customer_label(customer: CustomerInterface): string {
    const first_name = customer.profile?.first_name || '';
    const last_name = customer.profile?.last_name || '';
    const full_name = `${first_name} ${last_name}`.trim();

    return full_name || customer.phone_number;
  }
}
