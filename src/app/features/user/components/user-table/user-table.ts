import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { roles_labeled, UserInterface } from '../../interfaces/user.interface';
import { create_table_field, create_text_field } from '@/app/shared/ui/ui-table/ui-table_helper';
import { UiTable } from '@/app/shared/ui/ui-table/ui-table';
import { UserService } from '../../services/user.service';
import { AuthService } from '@/app/core/services/auth.service';
import { DatePipe } from '@angular/common';
import { UiBadge } from '@/app/shared/ui/ui-badge/ui-badge';
import { DashboardTableDropdown } from '@/app/features/dashboard/components/dashboard-table-dropdown/dashboard-table-dropdown';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { UserModal } from '../user-modal/user-modal';
import { UserProfileExpandable } from '../user-profile-expandable/user-profile-expandable';
import { UiBadgeVariants } from '@/app/shared/ui/ui-badge/ui-badge-variants';
import { UserPermissions } from '../user-permissions/user-permissions';

@Component({
  selector: 'user-table',
  standalone: true,
  imports: [UiTable, UiButton, UserModal],
  providers: [DatePipe],
  templateUrl: './user-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTable {
  userService = inject(UserService);
  authService = inject(AuthService);
  private datePipe = inject(DatePipe);

  user_modal_ref = viewChild<UserModal>('user_modal');

  get current_user_role() {
    return this.authService.user()?.role;
  }

  get show_actions() {
    return this.current_user_role === 'admin' || this.current_user_role === 'superuser';
  }

  get expandable_field() {
    return create_table_field<UserInterface, UserProfileExpandable>({
      label: '',
      component: UserProfileExpandable,
      getInputs: (row: UserInterface) => ({ profile: row.profile }),
    });
  }

  get fields() {
    const baseFields = [
      create_text_field<UserInterface>({
        label: 'Nombre de usuario',
        name: 'username',
        getValue: (row: UserInterface) => row.username,
        options: { sortable: true },
      }),
      create_text_field<UserInterface>({
        label: 'Correo electrónico',
        name: 'email',
        getValue: (row: UserInterface) => row.email,
        options: { sortable: true },
      }),
      create_text_field<UserInterface>({
        label: 'Teléfono',
        name: 'phone_number',
        getValue: (row: UserInterface) => row.phone_number,
      }),
      create_table_field<UserInterface, UiBadge>({
        label: 'Rol',
        component: UiBadge,
        name: 'role',
        getInputs: (row: UserInterface) => {
          //let variant: UiBadgeVariants = 'gray';
          // if (row.role === 'superuser') variant = 'success';
          // else if (row.role === 'admin') variant = 'alternative';
          // else if (row.role === 'employer') variant = 'success';
          // else if (row.role === 'customer') variant = 'danger';
          return { variant: 'alternative', _label: roles_labeled[row.role], dot: true };
        },
      }),
      create_table_field<UserInterface, UserPermissions>({
        label: 'Permisos',
        component: UserPermissions,
        name: 'permissions',
        getInputs: (row: UserInterface) => ({ permissions: row.permissions }),
      }),
      create_text_field<UserInterface>({
        label: 'Fecha de Creación',
        name: 'created_at',
        getValue: (row: UserInterface) => this.datePipe.transform(row.created_at, 'short'),
      }),
    ];

    if (this.show_actions) {
      baseFields.push(
        create_table_field<UserInterface, DashboardTableDropdown>({
          label: 'Acciones',
          component: DashboardTableDropdown,
          getInputs: (row: UserInterface) => {
            const is_current_superuser = this.current_user_role === 'superuser';

            // disable options if row is admin/superuser, unless we are superuser and row is admin
            const can_modify = !(
              row.role === 'superuser' ||
              (row.role === 'admin' && !is_current_superuser)
            );

            if (!can_modify) {
              return { identifier: row.id.toString(), items: [] };
            }

            const items: any[] = [];

            const actions = [];

            actions.push({
              label: row.disabled_at ? 'Habilitar' : 'Deshabilitar',
              icon: row.disabled_at ? 'arrow_up' : 'arrow_down',
              on_click: () => this.user_modal_ref()?.open_disable_modal(row),
            });

            if (row.role === 'employer') {
              actions.push({
                label: 'Modificar permisos',
                icon: 'edit',
                on_click: () => this.user_modal_ref()?.open_permissions_modal(row),
              });
            }

            if (actions.length > 0) items.push(actions);

            return {
              identifier: row.id.toString(),
              items,
            };
          },
        }),
      );
    }

    return baseFields;
  }
}
