import { ProductInterface } from '@/app/features/product/interfaces/product.interface';
import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  Injector,
  AfterViewInit,
  viewChild,
} from '@angular/core';
import { SelectMenuOption, UiSelectMenu } from '@/app/shared/ui/ui-select-menu/ui-select-menu';
import { firstValueFrom } from 'rxjs';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { runInInjectionContext } from '@angular/core';

@Component({
  selector: 'stock-filter',
  imports: [UiSelectMenu],
  templateUrl: './stock-filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockProductFilter implements AfterViewInit {
  http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private readonly injector = inject(Injector);
  query_params = toSignal(this.route.queryParams, {
    initialValue: this.route.snapshot.queryParams,
  });
  supplier = signal<SupplierInterface | null>(null);
  product = signal<ProductInterface | null>(null);

  selected_supplier = signal<SelectMenuOption[]>([]);
  selected_product = signal<SelectMenuOption[]>([]);

  select_menu_supplier = viewChild.required<UiSelectMenu>('select_menu_supplier');
  select_menu_product = viewChild.required<UiSelectMenu>('select_menu_product');

  async get_options<T extends { name: string }>(
    path: string,
    search: string = '',
  ): Promise<SelectMenuOption[]> {
    const res = await firstValueFrom(
      this.http.get<PaginationResponseInterface<T>>(path, {
        params: { search },
      }),
    );
    return res.data.map<SelectMenuOption>((item: any) => ({
      name: item.name,
      label: item.name,
      value: item,
    }));
  }

  constructor() {
    effect(() => {
      const params = this.query_params();
      const supplier_id = params['supplier_id'];
      const stock_id = params['stock_id'];

      if (!supplier_id) {
        this.supplier.set(null);
        this.selected_supplier.set([]);
        this.select_menu_supplier()?.clear_selection();
      }

      if (!stock_id) {
        this.product.set(null);
        this.selected_product.set([]);
        this.select_menu_product()?.clear_selection();
      }
    });
  }

  load_entity = async (id: string | null, target: 'supplier' | 'product') => {
    let path = '';

    if (target === 'supplier') {
      path = `/api/supplier`;
    } else {
      path = `/api/product`;
    }

    if (!id) {
      if (target === 'supplier') this.selected_supplier.set([]);
      else this.selected_product.set([]);
      return;
    }

    const entity = await firstValueFrom(this.http.get<any>(`${path}/${id}`));
    const option: SelectMenuOption = {
      label: entity.name,
      name: entity.name,
      value: entity,
    };

    if (target === 'supplier') {
      this.selected_supplier.set([option]);
      this.supplier.set(entity);
    } else {
      this.selected_product.set([option]);
      this.product.set(entity);
    }
  };

  async ngAfterViewInit(): Promise<void> {
    const initial_params = this.route.snapshot.queryParams;
    const initial_supplier_id = initial_params['supplier_id'] ?? null;
    const initial_stock_id = initial_params['stock_id'] ?? null;

    if (initial_supplier_id) {
      await this.load_entity(initial_supplier_id, 'supplier');
      this.supplier.set(this.selected_supplier()[0]?.value ?? null);
    }
    if (initial_stock_id) {
      await this.load_entity(initial_stock_id, 'product');
      this.product.set(this.selected_product()[0]?.value ?? null);
    }

    let is_initial_render = true;
    runInInjectionContext(this.injector, () => {
      effect((onCleanup) => {
        this.supplier();
        this.product();

        if (is_initial_render) {
          is_initial_render = false;
          return;
        }

        const params = {
          supplier_id: this.supplier()?.id ?? null,
          stock_id: this.product()?.id ?? null,
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
    });
  }
}
