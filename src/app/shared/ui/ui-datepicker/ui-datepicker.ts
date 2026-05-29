import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Datepicker, initDatepickers } from 'flowbite';
import { DateTime } from 'luxon';
import { UiButton } from '../ui-button/ui-button';
import { UiIcon } from '../ui-icon/ui-icon';
import { set_language } from '../../helpers/flowbite-helper';
import { datepicker_locale } from './ui-datepicker-locale';
import { FieldControllable } from '../../classes/field-controllable';
import { UiFieldControl } from '../../directives/ui-field.directive';
import { InputDirective } from '../../directives/input.directive';

@Component({
  selector: 'ui-datepicker',
  imports: [UiIcon, UiButton],
  templateUrl: './ui-datepicker.html',
  providers: [
    {
      provide: FieldControllable,
      useExisting: UiDatepicker,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDatepicker extends UiFieldControl implements FieldControllable {
  callback = input<(value: string | null) => void>(() => {});
  format = input<string>('yyyy-MM-dd');
  placeholder = input<string>('Selecciona una fecha');
  readonly model = inject(InputDirective<string | number>).adapter;
  min_date = input<string | null>(null);
  max_date = input<string | null>(null);

  datepicker_el = viewChild<ElementRef<HTMLInputElement>>('default_datepicker');

  can_clear = computed(() => Boolean(this.model()));

  ngAfterViewInit() {
    initDatepickers();
    const datepicker = new Datepicker(this.datepicker_el()?.nativeElement, {
      language: 'es',
      format: this.format().toLowerCase(),
      maxDate: this.max_date(),
      minDate: this.min_date(),
    });
    set_language(datepicker, { es: datepicker_locale.es });
  }

  update_value() {
    const input = this.datepicker_el()?.nativeElement;
    const value = input?.value || null;

    this.model().set(value);
    this.callback()(value);
    this.model().dirty();
  }

  clear_selection() {
    this.model().set(null);
    const input = this.datepicker_el()?.nativeElement;

    if (input) {
      input.value = '';
    }

    this.callback()(null);
  }
}
