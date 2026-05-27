import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { HttpClient } from '@angular/common/http';
import { SelectMenuOption, UiSelectMenu } from '@/app/shared/ui/ui-select-menu/ui-select-menu';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { UiPlaceholder } from '@/app/shared/ui/ui-textarea/ui-textarea';
import { movement_types } from '../../data/stock.data';
import { ProductInterface } from '@/app/features/product/interfaces/product.interface';
import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { MovementType } from '../../interfaces/movement.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'movement-form',
  imports: [UiField, UiSelectMenu, UiInput, UiPlaceholder],
  templateUrl: './movement-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementForm {
  http = inject(HttpClient);

  movement_type_options: SelectMenuOption[] = Object.entries(movement_types).map(
    ([value, option]) => ({
      label: option.label,
      name: option.label,
      value: value as MovementType,
    }),
  );

  model = signal({
    product: null as ProductInterface | null,
    type: 'purchase' as MovementType,
    supplier: null as SupplierInterface | null,
    quantity: 0,
    notes: '',
  });

  form = form(this.model, (schema_path) => {
    required(schema_path.product, {
      message: 'El producto es requerido',
    });
    required(schema_path.type, {
      message: 'El tipo de movimiento es requerido',
    });
    required(schema_path.quantity, {
      message: 'La cantidad es requerida',
    });
  });

  show_supplier = computed(() => this.model().type === 'purchase');
  show_notes = computed(() => this.model().type !== 'purchase');

  async get_product_values(search: string = ''): Promise<SelectMenuOption[]> {
    const params: Record<string, string> = {};
    if (search) {
      params['search'] = search;
    }

    const response = await firstValueFrom(
      this.http.get<PaginationResponseInterface<ProductInterface>>('/api/product', {
        params,
      }),
    );

    return response.data.map<SelectMenuOption>((product) => ({
      label: product.name,
      name: product.name,
      value: product,
    }));
  }

  async get_supplier_values(search: string = ''): Promise<SelectMenuOption[]> {
    const params: Record<string, string> = {};
    if (search) {
      params['search'] = search;
    }

    const response = await firstValueFrom(
      this.http.get<PaginationResponseInterface<SupplierInterface>>('/api/supplier', {
        params,
      }),
    );

    return response.data.map<SelectMenuOption>((supplier) => ({
      label: supplier.name,
      name: supplier.name,
      value: supplier,
    }));
  }
}
