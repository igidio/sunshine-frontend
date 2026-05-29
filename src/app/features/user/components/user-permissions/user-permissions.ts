import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { permissions_labeled } from '../../interfaces/user.interface';

@Component({
  selector: 'user-permissions',
  imports: [],
  templateUrl: './user-permissions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPermissions {
  permissions = input.required<string>();
  permissions_labeled = permissions_labeled;

  get permissions_list(): (keyof typeof permissions_labeled)[] {
    try {
      const perms = JSON.parse(this.permissions()) as (keyof typeof permissions_labeled)[];
      return Array.isArray(perms) ? perms : [];
    } catch {
      return [];
    }
  }
}
