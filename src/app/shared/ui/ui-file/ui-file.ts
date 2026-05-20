import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
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
  multiple = input(false, {
    transform: booleanAttribute,
  });
  large = input(false, {
    transform: booleanAttribute,
  });
  _id = input<string>('file_input');
  accept = input<string>('');
  max_size_in_kb = input<number>(0);
  file_selected = output<File | null>();
  file_error = output<string>();
  is_error = signal(false);
  _label = input<string | undefined>(undefined);
  helper = input<string | undefined>(undefined);

  file_input_ref = viewChild<ElementRef<HTMLInputElement>>('file_input');

  on_file_selected(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];

      if (this.max_size_in_kb() > 0 && file.size > this.max_size_in_kb() * 1024) {
        this.file_error.emit(`El archivo excede el límite de ${this.max_size_in_kb()} KB`);
        this.is_error.set(true);
        this.file_selected.emit(null);
        inputElement.value = '';
        return;
      }

      this.file_error.emit('');
      this.is_error.set(false);
      this.file_selected.emit(file);
    } else {
      this.file_selected.emit(null);
    }
  }

  clear_file() {
    this.is_error.set(false);
    this.file_error.emit('');
    this.file_selected.emit(null);

    const inputEl = this.file_input_ref();
    if (inputEl) {
      inputEl.nativeElement.value = '';
    }
  }
}
