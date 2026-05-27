import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '@/app/shared/services/toast.service';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { CategoryInterface } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  toastService = inject(ToastService);

  categories = signal<PaginationResponseInterface<CategoryInterface> | undefined>(undefined);
  is_loading = signal(false);
  selected_category = signal<CategoryInterface | null>(null);

  async get(params?: Record<string, string>) {
    this.is_loading.set(true);
    await firstValueFrom(
      this.http.get<PaginationResponseInterface<CategoryInterface>>('/api/category', { params }),
    )
      .then((data) => {
        this.categories.set(data);
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async delete(id: number) {
    this.is_loading.set(true);

    await firstValueFrom(this.http.delete(`/api/category/${id}`))
      .then(() => {
        this.categories.update((categories) => {
          if (!categories) return categories;
          return {
            ...categories,
            data: categories.data.filter((category) => category.id !== id),
          };
        });
        this.toastService.show({
          message: 'Categoria eliminada',
          type: 'success',
        });
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async create_or_update(formData: FormData) {
    let endpoint = '/api/category';
    let type: 'create' | 'update' = 'create';

    if (this.selected_category()) {
      endpoint += `/${this.selected_category()!.id}`;
      type = 'update';
    }

    await firstValueFrom(this.http[this.selected_category() ? 'patch' : 'post'](endpoint, formData))
      .then((response) => {
        this.categories.update((categories) => {
          if (!categories) return categories;

          return {
            ...categories,
            data:
              type === 'create'
                ? [response as CategoryInterface, ...categories.data]
                : categories.data.map((category) =>
                    category.id === (response as CategoryInterface).id
                      ? (response as CategoryInterface)
                      : category,
                  ),
          };
        });

        this.toastService.show({
          message: `Categoria ${type === 'update' ? 'actualizada' : 'creada'} exitosamente`,
          type: 'success',
        });
      })
      .catch((error) => {
        console.error('Error al crear la categoria:', error);
      });
  }

  async listen_to_query_params(component_destroy_ref: DestroyRef) {
    this.route.queryParams
      .pipe(takeUntilDestroyed(component_destroy_ref))
      .subscribe(async (params) => {
        if (params['table'] && params['table'] !== 'categories') return;
        await this.get(params);
      });
  }
}
