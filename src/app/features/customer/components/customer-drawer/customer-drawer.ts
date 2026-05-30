import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { CustomerService } from '../../services/customer.service';
import { CustomerInterface } from '../../interfaces/customer.interface';
import { CustomerForm } from '../customer-form/customer-form';

@Component({
  selector: 'customer-drawer',
  imports: [CustomerForm],
  templateUrl: './customer-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDrawer {
  customerService = inject(CustomerService);
  drawerService = inject(DrawerService);

  template_drawer_create = viewChild.required<TemplateRef<any>>('drawer_create_content');
  template_drawer_update = viewChild.required<TemplateRef<any>>('drawer_update_content');

  customer_form_create = viewChild<CustomerForm>('customer_form_create');
  customer_form_update = viewChild<CustomerForm>('customer_form_update');

  open_drawer_create() {
    this.setup_and_open_drawer({
      title: 'Crear cliente',
      customer: null,
      template: this.template_drawer_create(),
      on_submit: async () => this.customer_form_create()?.on_submit(new SubmitEvent('submit')),
    });
  }

  open_drawer_update(customer: CustomerInterface) {
    this.setup_and_open_drawer({
      title: 'Editar cliente',
      customer: customer,
      template: this.template_drawer_update(),
      on_submit: async () => this.customer_form_update()?.on_submit(new SubmitEvent('submit')),
    });
  }

  private setup_and_open_drawer(config: {
    title: string;
    customer: CustomerInterface | null;
    template: any;
    on_submit: () => Promise<boolean | void>;
  }) {
    this.customerService.selected_customer.set(config.customer);

    this.drawerService.set_header({
      title: config.title,
      show_close_button: true,
      show_divider: true,
    });

    this.drawerService.set_content(config.template);

    this.drawerService.set_footer([
      {
        label: 'Cerrar',
        variant: 'secondary',
        size: 'sm',
        action: () => {
          this.drawerService.close();
        },
      },
      {
        label: 'Guardar',
        variant: 'success',
        size: 'sm',
        action: async () => {
          await config.on_submit().then((result) => result === true && this.drawerService.close());
        },
      },
    ]);

    this.drawerService.open();

    this.drawerService.set_on_close(() => {
      this.customerService.selected_customer.set(null);
      this.drawerService.set_content(null);
    });
  }
}
