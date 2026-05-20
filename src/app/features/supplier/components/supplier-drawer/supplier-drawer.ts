import { SupplierService } from '@/app/features/supplier/services/supplier.service';
import { SupplierInterface } from '@/app/shared/interfaces/supplier.interface';
import { DrawerService } from '@/app/shared/services/drawer.service';
import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'supplier-drawer',
  imports: [],
  templateUrl: './supplier-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierDrawer {
  supplierService = inject(SupplierService);
  drawerService = inject(DrawerService);
  template_drawer_create = viewChild.required<TemplateRef<any>>('drawer_create_content');
  template_drawer_update = viewChild.required<TemplateRef<any>>('drawer_update_content');

  ngAfterViewInit() {
    this.open_drawer_create();
  }

  open_drawer_create() {
    this.supplierService.selected_supplier.set(null);
    this.drawerService.set_header({
      title: 'Editar proveedor',
      show_close_button: true,
      show_divider: true,
    });
    this.drawerService.set_content(this.template_drawer_create());
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
        action: () => {
          // Acción de guardar
        },
      },
    ]);
    this.drawerService.open();
  }

  open_drawer_update(supplier: SupplierInterface) {
    console.log('sadsad');

    this.supplierService.selected_supplier.set(supplier);
    this.drawerService.set_header({
      title: 'Editar proveedor',
      show_close_button: true,
    });
    this.drawerService.set_content(this.template_drawer_update());
    this.drawerService.open();
  }
}
