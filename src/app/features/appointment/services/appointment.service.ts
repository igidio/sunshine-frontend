import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { ToastService } from '@/app/shared/services/toast.service';
import { AppointmentInterface } from '../interfaces/appointment.interface';
import { CalendarEventExternal } from '@schedule-x/calendar';

export interface AppointmentPayload {
  date: string;
  time_start: string;
  time_end: string;
  customer_id: number;
  treatment_id: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  http = inject(HttpClient);
  toastService = inject(ToastService);

  appointments = signal<PaginationResponseInterface<AppointmentInterface> | undefined>(undefined);
  is_loading = signal(false);
  selected_appointment = signal<AppointmentInterface | null>(null);

  async get(params?: Record<string, string>) {
    this.is_loading.set(true);

    await firstValueFrom(
      this.http.get<PaginationResponseInterface<AppointmentInterface>>('/api/appointment', {
        params,
      }),
    )
      .then((data) => {
        this.appointments.set(data);
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  async create(appointment: AppointmentPayload) {
    await firstValueFrom(this.http.post<AppointmentInterface>('/api/appointment', appointment))
      .then((response) => {
        this.appointments.update((appointments) => {
          if (!appointments) return appointments;

          return {
            ...appointments,
            data: [response, ...appointments.data],
          };
        });

        this.toastService.show({
          message: 'Cita creada exitosamente',
          type: 'success',
        });
      })
      .finally(() => {
        this.selected_appointment.set(null);
      });
  }

  async update(appointment: AppointmentPayload) {
    const selected = this.selected_appointment();
    if (!selected) return;

    await firstValueFrom(
      this.http.patch<AppointmentInterface>(`/api/appointment/${selected.id}`, appointment),
    )
      .then((response) => {
        this.appointments.update((appointments) => {
          if (!appointments) return appointments;

          return {
            ...appointments,
            data: appointments.data.map((item) => (item.id === response.id ? response : item)),
          };
        });

        this.toastService.show({
          message: 'Cita actualizada exitosamente',
          type: 'success',
        });
      })
      .finally(() => {
        this.selected_appointment.set(null);
      });
  }

  async delete(id: number) {
    this.is_loading.set(true);

    await firstValueFrom(this.http.delete(`/api/appointment/${id}`))
      .then(() => {
        this.appointments.update((appointments) => {
          if (!appointments) return appointments;

          return {
            ...appointments,
            data: appointments.data.filter((item) => item.id !== id),
          };
        });

        this.toastService.show({
          message: 'Cita eliminada',
          type: 'success',
        });
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  mapped_items = (): CalendarEventExternal[] => {
    const timeZone = Temporal.Now.timeZoneId();

    return (
      this.appointments()?.data.map<CalendarEventExternal>((appointment) => {
        const date = DateTime.fromJSDate(new Date(appointment.date)).toFormat('yyyy-MM-dd');
        const start = Temporal.ZonedDateTime.from(
          `${date}T${this.normalize_time(appointment.time_start)}[${timeZone}]`,
        );
        const end = Temporal.ZonedDateTime.from(
          `${date}T${this.normalize_time(appointment.time_end)}[${timeZone}]`,
        );

        return {
          id: appointment.id.toString(),
          title: appointment.treatment?.name ?? 'Cita',
          start,
          end,
        };
      }) ?? []
    );
  };

  private normalize_time(value: string) {
    return value.length === 5 ? `${value}:00` : value;
  }
}
