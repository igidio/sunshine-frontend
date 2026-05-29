import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UserInterface } from '../../interfaces/user.interface';
import { DatePipe } from '@angular/common';
import { ProfileInterface } from '../../interfaces/profile.interface';

@Component({
  selector: 'user-profile-expandable',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './user-profile-expandable.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileExpandable {
  profile = input.required<ProfileInterface>();
}
