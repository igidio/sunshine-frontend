import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { debounce, form, minLength, required, submit, validate } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { UiTooltip } from '@/app/shared/ui/ui-tooltip/ui-tooltip';
import { ToastService } from '@/app/shared/services/toast.service';

@Component({
    selector: 'password-form',
    imports: [UiButton, UiField, UiInput, UiTooltip],
    templateUrl: './password-form.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordForm {
    token = input.required<string>();

    private http = inject(HttpClient);
    private router = inject(Router);
    private toast = inject(ToastService);

    model = signal({
        password: '',
        repeat_password: '',
    });

    form = form(this.model, (schema_path) => {
        debounce(schema_path.password, 300);

        required(schema_path.password, {
            message: 'La contraseña es requerida',
        });
        minLength(schema_path.password, 6, {
            message: 'La contraseña debe tener al menos 6 caracteres',
        });

        required(schema_path.repeat_password, {
            message: 'Repetir la contraseña es requerido',
        });
        validate(schema_path.repeat_password, ({ value, valueOf }) => {
            const repeat_password = value();
            const password = valueOf(schema_path.password);

            if (repeat_password !== password) {
                return {
                    kind: 'password_mismatch',
                    message: 'Las contraseñas no coinciden',
                };
            }
            return null;
        });
    });

    password_input_show = signal<boolean>(false);
    repeat_password_input_show = signal<boolean>(false);

    password_field_status = computed(() =>
        this.password_input_show()
            ? { type: 'text', label: 'Ocultar contraseña', placeholder: 'Nueva contraseña' }
            : { type: 'password', label: 'Mostrar contraseña', placeholder: 'Nueva contraseña' },
    );

    repeat_password_field_status = computed(() =>
        this.repeat_password_input_show()
            ? { type: 'text', label: 'Ocultar contraseña', placeholder: 'Repite la contraseña' }
            : { type: 'password', label: 'Mostrar contraseña', placeholder: 'Repite la contraseña' },
    );

    toggle_password_visibility() {
        this.password_input_show.update((current) => !current);
    }

    toggle_repeat_password_visibility() {
        this.repeat_password_input_show.update((current) => !current);
    }

    protected async on_submit(event: SubmitEvent) {
        event.preventDefault();

        submit(this.form, async (f) => {
            const values = f().value();

            if (values.password !== values.repeat_password) {
                this.toast.show({
                    message: 'Las contraseñas no coinciden',
                    duration: 4000,
                    type: 'danger',
                });
                return;
            }

            try {
                await firstValueFrom(
                    this.http.post(`/api/confirmation/password/${this.token()}`, {
                        password: values.password,
                    }),
                );
                this.toast.show({
                    message: 'Contraseña restablecida correctamente',
                    duration: 3000,
                    type: 'success',
                });
                this.router.navigate(['/auth/login']);
            } catch {
                this.toast.show({
                    message: 'Error al restablecer la contraseña. El enlace puede haber expirado.',
                    duration: 4000,
                    type: 'danger',
                });
            }
        });
    }
}
