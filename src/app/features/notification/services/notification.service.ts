import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NotificationInterface } from '../notification.interface';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  http = inject(HttpClient);
  notification_resource = httpResource<NotificationInterface[]>(() => '/api/notification');
  constructor() {}

  get_first() {
    return this.http.get('/api/notification');
  }

  get({ limit = 10, offset = 0 }: { limit?: number; offset?: number }) {
    return this.http.get('/api/notification', { params: { limit, offset } });
  }

  delete(id: number) {
    this.notification_resource.update((notifications) => notifications!.filter((n) => n.id !== id));
    //return this.http.delete(`/api/notification/${id}`);
  }
}
