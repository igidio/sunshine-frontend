import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'ui-file',
  imports: [],
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
}
