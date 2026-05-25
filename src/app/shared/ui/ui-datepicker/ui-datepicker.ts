import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { Datepicker, initDatepickers } from 'flowbite';
import { UiIcon } from '../ui-icon/ui-icon';
import { datepicker_locale } from './ui-datepicker-locale';

@Component({
  selector: 'ui-datepicker',
  imports: [UiIcon],
  templateUrl: './ui-datepicker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDatepicker {
  document = inject(DOCUMENT);

  datepicker_el = viewChild<ElementRef<HTMLInputElement>>('default_datepicker');

  set_language(picker: any, locales: any) {
    const range_picker = picker._options.rangePicker;
    const language = picker._options.language;

    if (!range_picker) {
      let vanilla_instance = picker.getDatepickerInstance();
      Object.assign(vanilla_instance.constructor.locales, locales);
      vanilla_instance.setOptions({ language });
    } else {
      for (let vanilla_instance of picker._datepickerInstance.datepickers) {
        Object.assign(vanilla_instance.constructor.locales, locales);
        vanilla_instance.setOptions({ language });
      }
    }
  }

  ngAfterViewInit() {
    initDatepickers();

    const datepicker = new Datepicker(this.datepicker_el()?.nativeElement, {
      language: 'es',
      format: 'dd/mm/yyyy',
    });
    this.set_language(datepicker, { es: datepicker_locale.es });

    console.log(datepicker);
  }
}
