import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '@/app/shared/services/toast.service';
import { AuthService } from '@/app/core/services/auth.service';

export interface ProfileUpdatePayload {
    first_name: string;
    last_name: string;
    birth_date: string;
    address?: string;
}

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private http = inject(HttpClient);
    private toastService = inject(ToastService);
    private authService = inject(AuthService);

    is_updating = signal(false);

    async update(data: ProfileUpdatePayload) {
        this.is_updating.set(true);

        try {
            await firstValueFrom(
                this.http.patch('/api/user/profile', {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    birth_date: data.birth_date,
                    ...(data.address ? { address: data.address } : {}),
                }),
            );

            this.toastService.show({
                message: 'Perfil actualizado correctamente',
                duration: 3000,
                type: 'success',
            });

            await this.authService.check_auth();
        } catch {
            this.toastService.show({
                message: 'Error al actualizar el perfil',
                duration: 4000,
                type: 'danger',
            });
        } finally {
            this.is_updating.set(false);
        }
    }
}
