import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { ModalService } from '@/app/shared/services/modal.service';
import { CategoryService } from '../../services/category.service';
import { CategoryInterface } from '../../interfaces/category.interface';

@Component({
  selector: 'category-modal',
  imports: [],
  templateUrl: './category-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryModal {
  categoryService = inject(CategoryService);
  modalService = inject(ModalService);
  template_delete_content = viewChild.required<TemplateRef<any>>('delete_content');

  open_delete_modal(category: CategoryInterface) {
    this.categoryService.selected_category.set(category);
    this.modalService.set_header({
      title: 'Eliminar categoria',
      show_close_button: true,
    });
    this.modalService.set_content(this.template_delete_content());
    this.modalService.set_footer({
      right_buttons: [
        {
          label: 'Cancelar',
          variant: 'secondary',
          size: 'md',
          action: () => {
            this.modalService.close();
          },
        },
        {
          label: 'Eliminar',
          variant: 'danger',
          size: 'md',
          action: async () => {
            await this.categoryService.delete(category.id);
            this.modalService.close();
          },
        },
      ],
    });
    this.modalService.open();
  }
}
