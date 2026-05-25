import { ProductInterface } from '@/app/features/product/interfaces/product.interface';
import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { SelectMenuOption, UiSelectMenu } from '@/app/shared/ui/ui-select-menu/ui-select-menu';
import { firstValueFrom } from 'rxjs';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { HttpClient } from '@angular/common/http';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'stock-filter',
  imports: [UiSelectMenu],
  templateUrl: './stock-filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockProductFilter {
  http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  model = signal<{
    supplier: SupplierInterface | null;
    product: ProductInterface | null;
  }>({
    supplier: null,
    product: null,
  });

  form = form(this.model);

  async get_product_options(search: string = ''): Promise<SelectMenuOption[]> {
    const products = await firstValueFrom(
      this.http.get<PaginationResponseInterface<ProductInterface>>('/api/product', {
        params: {
          search,
        },
      }),
    );
    return products.data.map<SelectMenuOption>((product) => ({
      name: product.name,
      label: product.name,
      value: product,
    }));
  }

  async get_supplier_options(search: string = ''): Promise<SelectMenuOption[]> {
    const suppliers = await firstValueFrom(
      this.http.get<PaginationResponseInterface<SupplierInterface>>('/api/supplier', {
        params: {
          search,
        },
      }),
    );
    return suppliers.data.map<SelectMenuOption>((supplier) => ({
      name: supplier.name,
      label: supplier.name,
      value: supplier,
    }));
  }

  constructor() {
    effect((onCleanup) => {
      const { supplier, product } = this.form().value();
      const params = {
        supplier_id: supplier?.id ?? null,
        product_id: product?.id ?? null,
      };

      const timer = window.setTimeout(() => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: params,
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      }, 200);

      onCleanup(() => clearTimeout(timer));
    });
  }
}
