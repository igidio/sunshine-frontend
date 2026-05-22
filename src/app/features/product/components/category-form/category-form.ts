import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { form, required, submit } from '@angular/forms/signals';
import { UiField } from '@/app/shared/ui/ui-field/ui-field';
import { UiInput } from '@/app/shared/ui/ui-input/ui-input';
import { UiPlaceholder } from '@/app/shared/ui/ui-textarea/ui-textarea';
import { UiButton } from '@/app/shared/ui/ui-button/ui-button';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'category-form',
  imports: [UiField, UiInput, UiPlaceholder, UiButton],
  templateUrl: './category-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryForm {
  categoryService = inject(CategoryService);

  constructor() {
    effect(() => {
      const category = this.categoryService.selected_category();
      if (category) {
        this.model.set({
          name: category.name || '',
          description: category.description || '',
        });
      }
    });
  }

  model = signal({
    name: '',
    description: '',
  });

  form = form(this.model, (schema_path) => {
    required(schema_path.name, {
      message: 'El nombre de la categoria es requerido',
    });
  });

  async on_submit(event: SubmitEvent) {
    event.preventDefault();

    await submit(this.form, async (form) => {
      const formData = new FormData();
      formData.append('name', form().value().name);
      formData.append('description', form().value().description);

      await this.categoryService.create_or_update(formData);
    });
  }
}
