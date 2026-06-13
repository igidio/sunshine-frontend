import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChartsService {
  http = inject(HttpClient);

  is_loading = signal(false);
  data = signal<any>(null);

  async get_data() {
    this.is_loading.set(true);
    await firstValueFrom(this.http.get('/api/dashboard')).then((data) => {
      this.data.set(data);
    }).finally(() => {
      this.is_loading.set(false);
    });
  }


}
