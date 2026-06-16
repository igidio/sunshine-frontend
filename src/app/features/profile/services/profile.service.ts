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

export interface UserUpdatePayload {
    username: string;
    email: string;
    phone_number: string;
}

export interface PasswordUpdatePayload {
    current_password: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private http = inject(HttpClient);
    private toastService = inject(ToastService);
    private authService = inject(AuthService);

    is_updating = signal(false);
    is_updating_user = signal(false);
    is_updating_password = signal(false);

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

    async update_user(data: UserUpdatePayload) {
        this.is_updating_user.set(true);

        try {
            await firstValueFrom(
                this.http.patch('/api/user/account', {
                    username: data.username,
                    email: data.email,
                    phone_number: data.phone_number,
                }),
            );

            this.toastService.show({
                message: 'Datos de cuenta actualizados correctamente',
                duration: 3000,
                type: 'success',
            });

            await this.authService.check_auth();
        } catch {
            this.toastService.show({
                message: 'Error al actualizar los datos de la cuenta',
                duration: 4000,
                type: 'danger',
            });
        } finally {
            this.is_updating_user.set(false);
        }
    }

    async update_password(data: PasswordUpdatePayload) {
        this.is_updating_password.set(true);

        try {
            await firstValueFrom(
                this.http.patch('/api/user/password', {
                    current_password: data.current_password,
                    password: data.password,
                }),
            );

            this.toastService.show({
                message: 'Contraseña actualizada correctamente',
                duration: 3000,
                type: 'success',
            });
        } catch {
            this.toastService.show({
                message: 'Error al actualizar la contraseña',
                duration: 4000,
                type: 'danger',
            });
        } finally {
            this.is_updating_password.set(false);
        }
    }
}
