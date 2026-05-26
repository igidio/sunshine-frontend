import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import type { IconValue } from '../../data/icons';
import { UiIcon } from '../ui-icon/ui-icon';
import { FieldControllable } from '../../classes/field-controllable';
import { InputDirective } from '../../directives/input.directive';
import { UiFieldControl } from '../../directives/ui-field.directive';
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
  hostDirectives: [
    {
      directive: InputDirective,
      inputs: ['field', 'value'],
      outputs: ['valueChange'],
    },
  ],
  imports: [UiIcon],
})
export class UiSelectMenu extends UiFieldControl implements AfterContentInit, FieldControllable {
  _placeholder = input<string>('');
  _type = input<string>('text');
  private readonly adapter = inject(InputDirective<string | number>).adapter;

  options = input<SelectMenuOption[]>([]);
  fetch_options = input<((search?: string) => Promise<SelectMenuOption[]>) | null>(null);
  select_menu_input_ref = viewChild.required<ElementRef<HTMLInputElement>>('select_menu_input');
  input_has_focus = signal(false);
  fetched_options = signal<SelectMenuOption[] | null>(null);
  current_options = computed(() => this.fetched_options() ?? this.options());
  closable = input(false, { transform: booleanAttribute });
  can_clear = computed(() => !!this.query() && this.closable());

  fill_current_options() {
    this.fetched_options.set(null);
  }
  menu_id: string | null = null;

  is_open = signal(false);
  is_loading = signal(false);
  query = signal('');
  debounce_timer: number | null = null;

  selected_option = computed(() => {
    const current = this.adapter().get();
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

  override ngAfterContentInit() {
    this.fill_current_options();
    this.query.set(this.selected_option()?.label ?? '');
    this.menu_id = this.id ? `${this.id}-menu` : null;
    if (this.id_from_label) {
      this.id = this.id_from_label;
    } else {
      this.id = this._id();
    }
  }

  constructor() {
    super();
    effect(() => {
      this.options();
      untracked(() => {
        this.query();
        this.selected_option();
        this.current_options();
      });

      const selected = this.options()?.find(
        (option) => JSON.stringify(option.value) === JSON.stringify(this.adapter().get()),
      );

      if (selected) {
        this.query.set(selected.label);
      }
    });
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
            this.fetched_options.set(options);
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
    this.adapter().touched();
    const current = this.selected_option();
    if (!current) return;

    this.query.set(current?.label ?? '');
    this.input_has_focus.set(false);
  }

  async handle_input(value: string) {
    this.query.set(value);
    this.is_open.set(true);
    if (this.fetch_options()) {
      await this.on_fetch(value);
    }
    this.adapter().dirty();
    this.input_has_focus.set(true);
  }

  handle_option_mouse_down(event: MouseEvent, option: SelectMenuOption) {
    event.preventDefault();
    this.select_option(option);
  }

  private select_option(option: SelectMenuOption) {
    this.adapter().set(option.value);
    this.adapter().dirty();
    this.is_open.set(false);
    this.query.set(option.label);
    this.select_menu_input_ref().nativeElement.blur();
  }

  clear_selection() {
    this.adapter().set(null);
    this.adapter().dirty();
    this.is_open.set(false);
    this.query.set('');
    this.select_menu_input_ref().nativeElement.blur();
  }
}
