import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-landing-appointment',
  templateUrl: './appointment.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingAppointment { }
