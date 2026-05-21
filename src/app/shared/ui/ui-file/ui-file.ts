import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { UiButton } from '../ui-button/ui-button';

@Component({
  selector: 'ui-file',
  imports: [UiButton],
  templateUrl: './ui-file.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiFile {
  _multiple = input(false, {
    transform: booleanAttribute,
  });
  large = input(false, {
    transform: booleanAttribute,
  });
  _id = input<string>('file_input');
  accept = input<string>('');
  max_size_in_kb = input<number>(0);
  file_selected = model<File[] | null>(null);
  max_files = input<number>(0);
  is_error = signal(false);
  _label = input<string | undefined>(undefined);
  helper = input<string | undefined>(undefined);
  file_error = output<string>();

  file_input_ref = viewChild<ElementRef<HTMLInputElement>>('file_input');

  delete_one(event: Event, index: number = 0) {
    const currentFiles = this.file_input_ref()?.nativeElement?.files;
    if (!currentFiles) return;

    const dataTransfer = new DataTransfer();
    Array.from(currentFiles)
      .filter((f, i) => i !== index)
      .forEach((f) => dataTransfer.items.add(f));

    const fileInput = this.file_input_ref();
    if (fileInput && fileInput.nativeElement) {
      fileInput.nativeElement.files = dataTransfer.files;
    }
    this.file_selected.set(Array.from(dataTransfer.files));
  }

  on_file_selected(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const files = Array.from(inputElement.files);
      const maxSize = this.max_size_in_kb();
      const maxFiles = this.max_files();

      if (maxFiles > 0 && files.length > maxFiles) {
        this.file_error.emit(`Solo se permite subir un máximo de ${maxFiles} archivos.`);
        this.is_error.set(true);
        this.file_selected.set(null);
        inputElement.value = '';
        return;
      }

      if (maxSize > 0) {
        const oversizedFile = files.find((file) => file.size > maxSize * 1024);

        if (oversizedFile) {
          this.file_error.emit(
            `Al menos un archivo (ej: ${oversizedFile.name}) excede el límite de ${maxSize} KB`,
          );
          this.is_error.set(true);
          this.file_selected.set(null);
          inputElement.value = '';
          return;
        }
      }

      this.file_error.emit('');
      this.is_error.set(false);
      this.file_selected.set(files);
    } else {
      this.file_selected.set(null);
    }
  }

  clear_file() {
    this.is_error.set(false);
    this.file_error.emit('');
    this.file_selected.set(null);

    const inputEl = this.file_input_ref();
    if (inputEl) {
      inputEl.nativeElement.value = '';
    }
  }
}
