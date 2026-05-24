import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';
import type { IconValue } from '../../data/icons';
import { UiIcon } from '../ui-icon/ui-icon';
import { FieldControllable } from '../../classes/field-controllable';
import { create_field_error } from '../../helpers/computed-values';

export interface SelectMenuOption {
  label: string;
  name: string;
  value: string | number;
  icon?: IconValue;
  color?: string;
}

@Component({
  selector: 'ui-select-menu',
  templateUrl: './ui-select-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: FieldControllable,
      useExisting: UiSelectMenu,
    },
  ],
  imports: [UiIcon],
})
export class UiSelectMenu implements AfterContentInit, FieldControllable {
  id_from_label?: string;

  _placeholder = input<string>('');
  _type = input<string>('text');
  _id = input<string>('default-id');
  field = input.required<Field<any, string | number>>();
  options = input<SelectMenuOption[]>([]);
  fetch_options = input<(() => Promise<void>) | null>(null);
  current_options = signal<SelectMenuOption[] | null>([]);
  select_menu_input_ref = viewChild.required<ElementRef<HTMLInputElement>>('select_menu_input');
  input_has_focus = signal(false);

  fill_current_options() {
    if (this.options()) {
      this.current_options.set(this.options());
    }
  }

  id: string | null = null;
  menu_id: string | null = null;

  is_open = signal(false);
  is_loading = signal(false);
  query = signal('');

  selected_option = computed(() => {
    const current = this.field()().value();
    return this.current_options()?.find((option) => option.value === current) ?? null;
  });

  // display_value = computed(() => {
  //   return this.selected_option()?.label ?? this.query();
  // });

  filtered_options = computed(() => {
    if (this.input_has_focus()) {
      const q = this.query().trim().toLowerCase();
      if (!q) return this.current_options();
      return this.current_options()?.filter((option) =>
        `${option.label} ${option.name}`.toLowerCase().includes(q),
      );
    }
    return this.current_options();
  });

  constructor() {
    effect(() => {
      const current = this.selected_option();
      if (current && !this.is_open()) {
        //this.query.set(current.label);
      }
    });
  }

  ngAfterContentInit() {
    this.fill_current_options();

    //this.id = this._id();
    this.menu_id = this.id ? `${this.id}-menu` : null;

    if (this.id_from_label) {
      this.id = this.id_from_label;
    } else {
      this.id = this._id();
    }
  }

  async handle_focus() {
    this.is_open.set(true);

    const fetcher = this.fetch_options();
    if (!fetcher || this.is_loading()) return;

    this.is_loading.set(true);
    try {
      await fetcher();
    } finally {
      this.is_loading.set(false);
    }
  }

  handle_blur() {
    this.is_open.set(false);
    this.field()().markAsTouched();

    const current = this.selected_option();
    console.log('bllllurrr');

    // if (this.query() == '' || !this.query()) {
    //   console.log('nada');

    this.query.set(current?.label ?? '');
    //this.field()().value.set(current?.value ?? null);
    //}
  }

  handle_input(value: string) {
    console.log(this.selected_option());

    this.query.set(value);
    this.is_open.set(true);
    //this.field()().markAsDirty();
  }

  handle_option_mouse_down(event: MouseEvent, option: SelectMenuOption) {
    event.preventDefault();
    this.select_option(option);
  }

  private select_option(option: SelectMenuOption) {
    this.field()().value.set(option.value);
    this.field()().markAsDirty();
    this.is_open.set(false);
    //this.query.set(option.label);
    this.select_menu_input_ref().nativeElement.blur();
    console.log('this.select_option');

    this.query.set(option.label);
  }

  error_message = create_field_error(this.field);
}
