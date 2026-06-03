import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { ToastService } from '@/app/shared/services/toast.service';
import { AuthService } from '@/app/core/services/auth.service';
import { TreatmentInterface } from '../interfaces/treatment.interface';

export interface TreatmentPayload {
  name: string;
  description: string;
  price: number;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class TreatmentService {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  treatments = signal<PaginationResponseInterface<TreatmentInterface> | undefined>(undefined);
  is_loading = signal(false);
  selected_treatment = signal<TreatmentInterface | null>(null);

  can_manage_treatments = this.authService.has_permission('TREATMENT');

  async get(params?: Record<string, string>) {
    this.is_loading.set(true);
    await firstValueFrom(
      this.http.get<PaginationResponseInterface<TreatmentInterface>>('/api/treatment', {
        params,
      }),
    )
      .then((data) => {
        this.treatments.set(data);
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async delete(id: number) {
    this.is_loading.set(true);

    await firstValueFrom(this.http.delete(`/api/treatment/${id}`))
      .then(() => {
        this.treatments.update((treatments) => {
          if (!treatments) return treatments;
          return {
            ...treatments,
            data: treatments.data.filter((treatment) => treatment.id !== id),
          };
        });
        this.toastService.show({
          message: 'Servicio eliminado',
          type: 'success',
        });
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async disable(id: number) {
    this.is_loading.set(true);

    await firstValueFrom(this.http.patch(`/api/treatment/${id}/disable`, {}))
      .then((treatment) => {
        this.treatments.update((treatments) => {
          if (!treatments) return treatments;
          return {
            ...treatments,
            data: treatments.data.map((item) =>
              item.id === (treatment as TreatmentInterface).id
                ? (treatment as TreatmentInterface)
                : item,
            ),
          };
        });
        this.toastService.show({
          message:
            'Servicio ' + (this.selected_treatment()?.disabled_at ? 'habilitado' : 'inhabilitado'),
          type: 'success',
        });
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async create_or_update(treatment: TreatmentPayload) {
    let endpoint = '/api/treatment';
    let type: 'create' | 'update' = 'create';

    if (this.selected_treatment()) {
      endpoint += `/${this.selected_treatment()!.id}`;
      type = 'update';
    }

    const request = this.selected_treatment()
      ? this.http.patch<TreatmentInterface>(endpoint, treatment)
      : this.http.post<TreatmentInterface>(endpoint, treatment);

    await firstValueFrom(request)
      .then((response) => {
        this.treatments.update((treatments) => {
          if (!treatments) return treatments;

          return {
            ...treatments,
            data:
              type === 'create'
                ? [response, ...treatments.data]
                : treatments.data.map((item) => (item.id === response.id ? response : item)),
          };
        });

        this.toastService.show({
          message: `Servicio ${type === 'update' ? 'actualizado' : 'creado'} exitosamente`,
          type: 'success',
        });
      })
      .finally(() => {
        this.selected_treatment.set(null);
      });
  }

  async listen_to_query_params(component_destroy_ref: DestroyRef) {
    this.route.queryParams
      .pipe(takeUntilDestroyed(component_destroy_ref))
      .subscribe(async (params) => {
        if (params['table'] && params['table'] !== 'treatment') return;
        await this.get(params);
      });
  }
}
