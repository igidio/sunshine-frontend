import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { form, max, maxLength, required, submit } from '@angular/forms/signals';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { UiPlaceholder } from '@/app/shared/ui/ui-textarea/ui-textarea';
import { TreatmentPayload, TreatmentService } from '../../services/treatment.service';

interface TreatmentFormValue {
  service_name: string;
  service_description: string;
  service_price: number;
  service_duration: number;
}

@Component({
  selector: 'treatment-form',
  imports: [UiField, UiInput, UiPlaceholder],
  templateUrl: './treatment-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreatmentForm {
  treatmentService = inject(TreatmentService);

  model = signal<TreatmentFormValue>({
    service_name: '',
    service_description: '',
    service_price: 0,
    service_duration: 0,
  });

  constructor() {
    effect(() => {
      const treatment = this.treatmentService.selected_treatment();

      if (treatment) {
        this.model.set({
          service_name: treatment.name || '',
          service_description: treatment.description || '',
          service_price: treatment.price || 0,
          service_duration: treatment.duration || 0,
        });
        return;
      }

      this.model.set({
        service_name: '',
        service_description: '',
        service_price: 0,
        service_duration: 0,
      });
    });
  }

  form = form(this.model, (schema_path) => {
    required(schema_path.service_name, {
      message: 'El nombre del servicio es requerido',
    });
    maxLength(schema_path.service_name, 255, {
      message: 'El nombre del servicio no puede superar los 255 caracteres',
    });
    required(schema_path.service_description, {
      message: 'La descripción del servicio es requerida',
    });
    maxLength(schema_path.service_description, 2000, {
      message: 'La descripción del servicio no puede superar los 2000 caracteres',
    });
    required(schema_path.service_price, {
      message: 'El precio del servicio es requerido',
    });
    required(schema_path.service_duration, {
      message: 'La duración del servicio es requerida',
    });
    max(schema_path.service_duration, 120, {
      message: 'La duración del servicio no puede superar los 120 minutos',
    });
  });

  name_field = this.form.service_name;
  description_field = this.form.service_description;
  price_field = this.form.service_price;
  duration_field = this.form.service_duration;

  async on_submit(event: SubmitEvent) {
    event.preventDefault();

    return await submit(this.form, async (form) => {
      const value = form().value();
      await this.treatmentService.create_or_update({
        name: value.service_name,
        description: value.service_description,
        price: value.service_price,
        duration: value.service_duration,
      });
    });
  }
}
