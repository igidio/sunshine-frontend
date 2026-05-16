import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';
import { NotificationInterface, NotificationResultInterface } from '../notification.interface';
import { ToastService } from '@/app/shared/services/toast.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  http = inject(HttpClient);
  toastService = inject(ToastService);
  is_loading_more = signal(false);
  offset = signal(0);
  limit = signal(10);

  constructor() {}

  notification_resource = resource({
    params: () => ({
      limit: this.limit(),
      offset: this.offset(),
    }),
    loader: async ({ params }): Promise<NotificationResultInterface> =>
      await firstValueFrom(
        this.http.get<NotificationResultInterface>('/api/notification', {
          params,
        }),
      ),
  });

  get_first() {
    return this.http.get('/api/notification');
  }

  get({ limit = 10, offset = 0 }: { limit?: number; offset?: number }) {
    return this.http.get('/api/notification', { params: { limit, offset } });
  }

  async delete(id: number) {
    await firstValueFrom(this.http.delete(`/api/notification/${id}`))
      .catch((err) => {})
      .then(() => {
        this.notification_resource.update((result) => ({
          ...result,
          notifications: result?.notifications.filter((n) => n.id !== id) || [],
          total: result?.total ?? 0,
        }));
        this.toastService.show({
          message: 'Notificación eliminada',
          type: 'success',
        });
      });
  }

  async refetch() {
    this.limit.set(10);
    this.offset.set(0);
    this.is_loading_more.set(false);
    const res = await firstValueFrom(
      this.http.get<NotificationResultInterface>('/api/notification', {
        params: {
          limit: this.limit(),
          offset: this.offset(),
        },
      }),
    )
      .then((res) => {
        this.notification_resource.set(res);
        this.toastService.show({
          message: 'Notificaciones actualizadas',
          type: 'success',
        });
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        this.is_loading_more.set(false);
      });
  }

  load_more() {
    this.is_loading_more.set(true);

    if (this.notification_resource.value() == undefined) return;

    const current_offset =
      this.offset() + this.notification_resource.value()!.notifications.length || 0;

    this.http
      .get('/api/notification', {
        params: { offset: current_offset },
      })
      .subscribe({
        next: (res: any) => {
          this.notification_resource.update((notification_request) => ({
            ...notification_request,
            notifications: [...(notification_request?.notifications || []), ...res.notifications],
            total: notification_request?.total ?? 0,
          }));
          this.is_loading_more.set(false);
        },
        error: (err) => {
          console.error(err);
          this.is_loading_more.set(false);
        },
      });
  }

  has_unread = computed(() => {
    if (!this.notification_resource.hasValue()) return false;
    const notifications = this.notification_resource.value()?.notifications || [];
    return notifications.some((n) => !n.read_at);
  });

  mark_all_as_read() {
    if (!this.has_unread()) {
      return;
    }

    this.http.post('/api/notification/read_all', {}).subscribe({
      next: () => {
        this.notification_resource.update((notification_request) => ({
          ...notification_request,
          notifications:
            notification_request?.notifications.map((n) => ({
              ...n,
              readed_at: new Date(),
            })) || [],
          total: notification_request?.total ?? 0,
        }));
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
