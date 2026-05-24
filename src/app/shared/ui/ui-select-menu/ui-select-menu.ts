import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';
import type { IconValue } from '../../data/icons';
import { UiIcon } from '../ui-icon/ui-icon';
import { FieldControllable } from '../../classes/field-controllable';
import { create_field_error } from '../../helpers/computed-values';
import { JsonPipe } from '@angular/common';

export interface SelectMenuOption {
  label: string;
  name: string;
  value: any;
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
  fetch_options = input<((search?: string) => Promise<SelectMenuOption[]>) | null>(null);
  select_menu_input_ref = viewChild.required<ElementRef<HTMLInputElement>>('select_menu_input');
  input_has_focus = signal(false);
  current_options = signal<SelectMenuOption[] | null>([]);

  fill_current_options() {
    this.current_options.set(this.options());
  }

  id: string | null = null;
  menu_id: string | null = null;

  is_open = signal(false);
  is_loading = signal(false);
  query = signal('');
  debounce_timer: number | null = null;

  selected_option = computed(() => {
    const current = this.field()().value();
    return this.current_options()?.find((option) => option.value === current) ?? null;
  });

  filtered_options = computed(() => {
    if (this.input_has_focus() && !this.fetch_options()) {
      const q = this.query().trim().toLowerCase();
      if (!q) return this.current_options();
      return this.current_options()?.filter((option) =>
        `${option.label} ${option.name}`.toLowerCase().includes(q),
      );
    }
    return this.current_options();
  });

  ngAfterContentInit() {
    this.fill_current_options();
    this.query.set(this.selected_option()?.label ?? '');
    this.menu_id = this.id ? `${this.id}-menu` : null;
    if (this.id_from_label) {
      this.id = this.id_from_label;
    } else {
      this.id = this._id();
    }
  }

  async on_fetch(value: string = '', force: boolean = false) {
    if (this.fetch_options()) {
      if (this.debounce_timer) {
        clearTimeout(this.debounce_timer);
      }
      this.debounce_timer = window.setTimeout(
        async () => {
          try {
            this.is_loading.set(true);
            const options = await this.fetch_options()!(value);
            this.current_options.set(options);
          } finally {
            this.is_loading.set(false);
          }
        },
        force ? 0 : 300,
      );
    }
  }

  async handle_focus() {
    this.is_open.set(true);
    if (this.fetch_options()) {
      await this.on_fetch('', true);
    }
  }

  handle_blur() {
    this.is_open.set(false);
    this.field()().markAsTouched();
    const current = this.selected_option();
    this.query.set(current?.label ?? '');
    this.input_has_focus.set(false);
  }

  async handle_input(value: string) {
    this.query.set(value);
    this.is_open.set(true);
    if (this.fetch_options()) {
      await this.on_fetch(value, true);
    }
    this.field()().markAsDirty();
    this.input_has_focus.set(true);
  }

  handle_option_mouse_down(event: MouseEvent, option: SelectMenuOption) {
    event.preventDefault();
    this.select_option(option);
  }

  private select_option(option: SelectMenuOption) {
    this.field()().value.set(option.value);
    this.field()().markAsDirty();
    this.is_open.set(false);
    this.query.set(option.label);
    this.select_menu_input_ref().nativeElement.blur();
  }

  error_message = create_field_error(this.field);
}
