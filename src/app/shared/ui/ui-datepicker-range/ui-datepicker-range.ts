import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';
import { set_language } from '../../helpers/flowbite-helper';
import { FormsModule, NgModel } from '@angular/forms';
import { Datepicker, initDatepickers } from 'flowbite';
import { datepicker_locale } from '../ui-datepicker/ui-datepicker-locale';

export interface DatePickerRangeValue {
  from: string | Date | null;
  to: string | Date | null;
}

@Component({
  selector: 'ui-datepicker-range',
  imports: [UiIcon, FormsModule],
  templateUrl: './ui-datepicker-range.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDatepickerRange {
  datepicker_range = viewChild<ElementRef>('datepicker_range');

  inputt = signal<string>('');

  range_start = viewChild<ElementRef<HTMLInputElement>>('range_start');
  range_end = viewChild<ElementRef<HTMLInputElement>>('range_end');

  value = model<DatePickerRangeValue | null>(null);

  ngAfterViewInit() {
    initDatepickers();

    const datepicker = new Datepicker(this.datepicker_range()?.nativeElement, {
      language: 'es',
      format: 'dd/mm/yyyy',
      rangePicker: true,
      maxDate: new Date().toLocaleDateString('es-ES').toString(),
    });
    set_language(datepicker, { es: datepicker_locale.es });
  }

  update_value(part: 'from' | 'to', value: string) {
    this.value.update((v) => ({ ...(v ?? { from: null, to: null }), [part]: value }));
  }
}
