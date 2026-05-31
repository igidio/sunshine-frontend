import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { RouterLink } from '@angular/router';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { AppointmentDrawer } from '../components/appointment-drawer/appointment-drawer';
import { AppointmentModal } from '../components/appointment-modal/appointment-modal';

@Component({
  selector: 'appointment-info',
  imports: [DatePipe, RouterLink, UiButton, AppointmentDrawer, AppointmentModal],
  templateUrl: './appointment-info.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentInfo {
  appointmentService = inject(AppointmentService);

  appointment_drawer_ref = viewChild<AppointmentDrawer>('appointment_drawer');
  appointment_modal_ref = viewChild<AppointmentModal>('appointment_modal');
}
