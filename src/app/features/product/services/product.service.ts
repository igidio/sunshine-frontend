import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '@/app/shared/services/toast.service';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { ProductModule } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  toastService = inject(ToastService);
  destroyRef = inject(DestroyRef);

  products = signal<PaginationResponseInterface<ProductModule> | undefined>(undefined);
  is_loading = signal(false);
  selected_product = signal<ProductModule | null>(null);

  async get(params?: Record<string, string>) {
    this.is_loading.set(true);
    await firstValueFrom(
      this.http.get<PaginationResponseInterface<ProductModule>>('/api/product', { params }),
    )
      .then((data) => {
        this.products.set(data);
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async delete(id: number) {
    this.is_loading.set(true);

    await firstValueFrom(this.http.delete(`/api/product/${id}`))
      .then(() => {
        this.products.update((products) => {
          if (!products) return products;
          return {
            ...products,
            data: products.data.filter((product) => product.id !== id),
          };
        });
        this.toastService.show({
          message: 'Producto eliminado',
          type: 'success',
        });
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async disable(id: number) {
    this.is_loading.set(true);

    await firstValueFrom(this.http.patch(`/api/product/${id}/disable`, {}))
      .then(() => {
        this.products.update((products) => {
          if (!products) return products;
          return {
            ...products,
            data: products.data.map((product) => {
              if (product.id === id) {
                return {
                  ...product,
                  disabled_at: product.disabled_at ? null : new Date(),
                };
              }
              return product;
            }),
          };
        });
        this.toastService.show({
          message:
            'Producto ' + (this.selected_product()?.disabled_at ? 'habilitado' : 'deshabilitado'),
          type: 'success',
        });
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async create_or_update(formData: FormData) {
    let endpoint = '/api/product';
    let type: 'create' | 'update' = 'create';

    if (this.selected_product()) {
      endpoint += `/${this.selected_product()!.id}`;
      type = 'update';
    }

    await firstValueFrom(this.http[this.selected_product() ? 'patch' : 'post'](endpoint, formData))
      .then((response) => {
        this.products.update((products) => {
          if (!products) return products;

          return {
            ...products,
            data:
              type === 'create'
                ? [response as ProductModule, ...products.data]
                : products.data.map((product) =>
                    product.id === (response as ProductModule).id
                      ? (response as ProductModule)
                      : product,
                  ),
          };
        });

        this.toastService.show({
          message: `Producto ${type === 'update' ? 'actualizado' : 'creado'} exitosamente`,
          type: 'success',
        });
      })
      .catch((error) => {
        console.error('Error al crear el producto:', error);
      });
  }

  async listen_to_query_params() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (params) => {
      await this.get(params);
    });
  }
}
