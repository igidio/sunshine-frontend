import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  input,
  model,
  viewChild,
} from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';
import { set_language } from '../../helpers/flowbite-helper';
import { FormsModule } from '@angular/forms';
import { Datepicker } from 'flowbite';
import { datepicker_locale } from '../ui-datepicker/ui-datepicker-locale';
import { DateTime } from 'luxon';
import { UiButton } from '../ui-button/ui-button';

export interface DatePickerRangeValue {
  from: string | null;
  to: string | null;
}

@Component({
  selector: 'ui-datepicker-range',
  imports: [UiIcon, FormsModule, UiButton],
  templateUrl: './ui-datepicker-range.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDatepickerRange implements AfterViewInit, OnDestroy {
  datepicker_range = viewChild<ElementRef>('datepicker_range');

  callback = input<(value: DatePickerRangeValue | null) => void>(() => { });
  format = input<string>('yyyy-MM-dd');

  range_start = viewChild<ElementRef<HTMLInputElement>>('range_start');
  range_end = viewChild<ElementRef<HTMLInputElement>>('range_end');

  value = model<DatePickerRangeValue | null>(null);

  can_clear = computed(() => Boolean(this.value()?.from || this.value()?.to));

  datepicker: Datepicker | null = null;

  ngAfterViewInit() {
    this.datepicker = new Datepicker(this.datepicker_range()?.nativeElement, {
      language: 'es',
      format: this.format().toLowerCase(),
      rangePicker: true,
      maxDate: DateTime.now().toFormat(this.format()),
      minDate: DateTime.now().minus({ years: 10 }).toFormat(this.format()),
    });
    set_language(this.datepicker, { es: datepicker_locale.es });
  }

  ngOnDestroy() {
    this.datepicker?.destroy();
  }

  update_value(part: 'from' | 'to', value: string) {
    this.value.update((v) => ({
      ...(v ?? { from: null, to: null }),
      [part]: value,
    }));
    this.callback()(this.value());
  }

  clear_selection() {
    this.value.set(null);
    const start = this.range_start()?.nativeElement;
    const end = this.range_end()?.nativeElement;

    if (start) {
      start.value = '';
    }
    if (end) {
      end.value = '';
    }
    this.callback()(this.value());
  }
}
