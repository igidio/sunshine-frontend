import { HttpClient } from '@angular/common/http';
import { computed, DOCUMENT, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';
import { PaginationResponseInterface } from '@/app/shared/interfaces/common.interface';
import { ToastService } from '@/app/shared/services/toast.service';
import { AppointmentInterface } from '../interfaces/appointment.interface';
import {
  CalendarApp,
  CalendarEventExternal,
  createCalendar,
  PluginBase,
} from '@schedule-x/calendar';
import BreakpointHelper from '@/app/shared/helpers/breakpoint';
import { createEventsServicePlugin } from '@schedule-x/events-service';

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
  event_service_plugin = createEventsServicePlugin();


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
        this.event_service_plugin.update({
          id: response.id.toString(),
          title: response.treatment?.name ?? 'Cita',
          start: Temporal.ZonedDateTime.from(
            `${DateTime.fromJSDate(new Date(response.date)).toFormat('yyyy-MM-dd')}T${response.time_start.length === 5 ? `${response.time_start}:00` : response.time_start
            }[${Temporal.Now.timeZoneId()}]`,
          ),
          end: Temporal.ZonedDateTime.from(
            `${DateTime.fromJSDate(new Date(response.date)).toFormat('yyyy-MM-dd')}T${response.time_end.length === 5 ? `${response.time_end}:00` : response.time_end
            }[${Temporal.Now.timeZoneId()}]`,
          ),
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

        this.event_service_plugin.remove(id.toString());
      })
      .finally(() => {
        this.is_loading.set(false);
      });
  }

  mapped_items = computed<CalendarEventExternal[]>(() => {
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
  });

  private normalize_time(value: string) {
    return value.length === 5 ? `${value}:00` : value;
  }
}
