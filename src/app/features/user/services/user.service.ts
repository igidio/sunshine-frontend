import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { UserInterface } from '../interfaces/user.interface';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@/app/shared/services/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);

  users = signal<PaginationResponseInterface<UserInterface> | null>(null);
  selected_user = signal<UserInterface | null>(null);
  is_loading = signal<boolean>(false);

  async get(params: any = {}) {
    this.is_loading.set(true);

    const result = await firstValueFrom(
      this.http.get<PaginationResponseInterface<UserInterface>>('/api/user', {
        params,
      }),
    ).finally(() => {
      this.is_loading.set(false);
    });
    return result;
  }

  async disable(id: number) {
    this.is_loading.set(true);
    try {
      await firstValueFrom(this.http.patch(`/api/user/${id}/disable`, {}));
      this.toastService.show({
        message: 'El estado del usuario se actualizó correctamente',
        type: 'success',
      });
      await this.get(this.route.snapshot.queryParams);
    } catch {
    } finally {
      this.is_loading.set(false);
    }
  }

  listen_to_query_params(component_destroy_ref: DestroyRef) {
    this.route.queryParams
      .pipe(takeUntilDestroyed(component_destroy_ref))
      .subscribe(async (params) => {
        await this.get(params).then((data) => {
          this.users.set(data);
        });
      });
  }
}
