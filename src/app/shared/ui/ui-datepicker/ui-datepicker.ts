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
import { InputDirective } from '../../directives/input.directive';
import { set_language } from '../../helpers/flowbite-helper';

@Component({
  selector: 'ui-datepicker',
  imports: [UiIcon],
  templateUrl: './ui-datepicker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: InputDirective,
      inputs: ['field', 'value'],
      outputs: ['valueChange'],
    },
  ],
})
export class UiDatepicker {
  document = inject(DOCUMENT);
  model = inject(InputDirective).adapter;
  datepicker_el = viewChild<ElementRef<HTMLInputElement>>('default_datepicker');
  ngAfterViewInit() {
    initDatepickers();
    const datepicker = new Datepicker(this.datepicker_el()?.nativeElement, {
      language: 'es',
      format: 'dd/mm/yyyy',
      maxDate: '01/01/2027',
    });
    set_language(datepicker, { es: datepicker_locale.es });
  }
}
