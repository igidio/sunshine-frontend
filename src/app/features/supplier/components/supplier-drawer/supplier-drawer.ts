import { SupplierService } from '@/app/features/supplier/services/supplier.service';
import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { SupplierForm } from '../supplier-form/supplier-form';

@Component({
  selector: 'supplier-drawer',
  imports: [SupplierForm],
  templateUrl: './supplier-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierDrawer {
  supplierService = inject(SupplierService);
  drawerService = inject(DrawerService);

  template_drawer_create = viewChild.required<TemplateRef<any>>('drawer_create_content');
  template_drawer_update = viewChild.required<TemplateRef<any>>('drawer_update_content');

  supplier_form_create = viewChild<SupplierForm>('supplier_form_create');
  supplier_form_update = viewChild<SupplierForm>('supplier_form_update');

  open_drawer_create() {
    this.setup_and_open_drawer({
      title: 'Crear proveedor',
      supplier: null,
      template: this.template_drawer_create(),
      on_submit: async () => {
        await this.supplier_form_create()?.on_submit(new SubmitEvent('submit'));
      },
    });
  }

  open_drawer_update(supplier: SupplierInterface) {
    this.setup_and_open_drawer({
      title: 'Editar proveedor',
      supplier: supplier,
      template: this.template_drawer_update(),
      on_submit: async () => {
        await this.supplier_form_update()?.on_submit(new SubmitEvent('submit'));
      },
    });
  }

  private setup_and_open_drawer(config: {
    title: string;
    supplier: SupplierInterface | null;
    template: any;
    on_submit: () => Promise<void>;
  }) {
    this.supplierService.selected_supplier.set(config.supplier);

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
          await config.on_submit().then(() => {
            this.drawerService.close();
          });
        },
      },
    ]);

    this.drawerService.open();
  }
}
