import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { UserInterface } from '../../interfaces/user.interface';
import { ModalService } from '@/app/shared/services/modal.service';
import { UserService } from '../../services/user.service';
import { TemplateRef } from '@angular/core';
import { InviteForm } from '../invite-form/invite-form';

@Component({
  selector: 'user-modal',
  imports: [InviteForm],
  templateUrl: './user-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserModal {
  private modalService = inject(ModalService);
  private userService = inject(UserService);

  invite_modal = viewChild.required<TemplateRef<any>>('invite_modal');
  disable_modal = viewChild.required<TemplateRef<any>>('disable_modal');
  permissions_modal = viewChild.required<TemplateRef<any>>('permissions_modal');

  open_invite_modal() {
    this.modalService.open();
    this.modalService.set_header({ title: 'Enviar invitación' });
    this.modalService.set_content(this.invite_modal());
  }

  open_disable_modal(user: UserInterface) {
    this.userService.selected_user.set(user);
    const is_disabled = !!user.disabled_at;
    this.modalService.open();
    this.modalService.set_header({
      title: is_disabled ? 'Habilitar usuario' : 'Deshabilitar usuario',
    });
    this.modalService.set_content(this.disable_modal());
    this.modalService.set_footer({
      right_buttons: [
        {
          label: 'Cancelar',
          action: () => this.modalService.close(),
          variant: 'secondary',
          size: 'md',
        },
        {
          label: is_disabled ? 'Habilitar' : 'Deshabilitar',
          action: async () => {
            await this.userService.disable(user.id);
            this.modalService.close();
          },
          variant: is_disabled ? 'success' : 'danger',
          size: 'md',
        },
      ],
    });
  }

  open_permissions_modal(user: UserInterface) {
    this.userService.selected_user.set(user);
    this.modalService.open();
    this.modalService.set_header({ title: 'Modificar permisos' });
    this.modalService.set_content(this.permissions_modal());
    this.modalService.set_footer({
      right_buttons: [
        {
          label: 'Cerrar',
          action: () => this.modalService.close(),
          variant: 'secondary',
          size: 'md',
        },
      ],
    });
  }
}
