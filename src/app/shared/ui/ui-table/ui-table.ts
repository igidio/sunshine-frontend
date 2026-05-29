import { Datepicker } from 'flowbite';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';

import { NgComponentOutlet, NgClass } from '@angular/common';
import { TableField } from './ui-table_helper';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { UiButton } from '../ui-button/ui-button';
import { UiIcon } from '../ui-icon/ui-icon';
import { UiDropdown } from '../ui-dropdown/ui-dropdown';
import { UiBadge } from '../ui-badge/ui-badge';
import { UiPagination } from '../ui-pagination/ui-pagination';
import type { PaginationResponseInterface } from '../../interfaces/common.interface';
import { on_scroll } from '../../helpers/dom_helper';
import {
  DatePickerRangeValue,
  UiDatepickerRange,
} from '../ui-datepicker-range/ui-datepicker-range';
import { DateTime } from 'luxon';
import { string_to_js_date } from '../../helpers/date_helper';

export interface FilterBy {
  name: string;
  label: string;
  options: { label: string; value: any }[];
  only_cancellable?: boolean;
  show_value_on_badge?: boolean;
}

@Component({
  selector: 'ui-table',
  imports: [
    NgComponentOutlet,
    NgClass,
    UiBadge,
    UiButton,
    UiIcon,
    UiDropdown,
    UiPagination,
    UiDatepickerRange,
  ],
  templateUrl: './ui-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'scroll_table()',
  },
})
export class UiTable<T> {
  document = inject(DOCUMENT);
  router = inject(Router);
  route = inject(ActivatedRoute);
  content = input<PaginationResponseInterface<T> | undefined>({
    count: 0,
    data: [],
    is_last_page: true,
    limit: 10,
    offset: 0,
  } as PaginationResponseInterface<T>);
  fields = input.required<TableField<T, any>[]>();
  expandable = input<TableField<T, any> | undefined>(undefined);
  limits = input<number[] | null>(null);
  search = input(false, {
    transform: booleanAttribute,
  });
  pagination = input(false, {
    transform: booleanAttribute,
  });
  _datepicker = input(false, {
    transform: booleanAttribute,
  });

  sortable = computed(() => {
    return this.fields()
      .filter((field) => field.options?.sortable && field.name)
      .map((field) => field.name);
  });

  filters = input<FilterBy[] | null>(null);
  fetch_on_scroll = input<() => Promise<void>>();
  lock_scroll = input(false, {
    transform: booleanAttribute,
  });

  expanded_rows = signal<Set<number>>(new Set());
  datepicker_range = signal<DatePickerRangeValue | null>(null);

  query_params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  search_ref = viewChild<ElementRef>('table_search_input');

  query_params_object = computed(() =>
    Object.fromEntries(
      this.query_params().keys.map((key) => [key, this.query_params().getAll(key)]),
    ),
  );

  constructor() {
    effect(() => {
      const search = this.query_params_object()['search'];
      const search_value = search && search[0] ? search[0] : '';
      const to = this.query_params_object()['to'];
      const from = this.query_params_object()['from'];

      if (to || from) {
        this.datepicker_range.update((value) => ({
          from: from && from[0] ? from[0] : value?.from || null,
          to: to && to[0] ? to[0] : value?.to || null,
        }));
        this.apply_function({ from, to });
      } else {
        this.datepicker_range.set(null);
      }

      const search_element = this.search_ref();
      if (search_element) {
        search_element.nativeElement.value = search_value;
      }
      this.reset_expanded();
    });
  }

  sort_by = (name?: keyof T) => {
    if (!name || !this.sortable().includes(name)) return;
    let order: 'asc' | 'desc' | null = null;
    const current_order = this.route.snapshot.queryParamMap.get('order');
    const current_sort_by = this.route.snapshot.queryParamMap.get('sort_by');

    if (current_sort_by !== name) {
      order = 'asc';
    } else {
      order = current_order === 'asc' ? 'desc' : current_order === 'desc' ? null : 'asc';
    }

    this.apply_function({ sort_by: order && name, order });
  };

  private search_timer: ReturnType<typeof setTimeout> | null = null;

  apply_function(object: Object) {
    this.router.navigate([], {
      queryParams: object,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  apply_conditions(object: Object) {
    this.apply_function(object);
  }

  apply_filter(filter_name: string, value: any) {
    this.apply_function({ [filter_name]: value });
  }

  apply_date_range(value: DatePickerRangeValue | null) {
    this.apply_function({ from: value?.from || null, to: value?.to || null });
  }

  apply_search(value: string, delay = 300) {
    if (this.search_timer) clearTimeout(this.search_timer);

    if (value === '') {
      this.apply_function({ search: null });
      return;
    }

    this.search_timer = window.setTimeout(() => {
      this.apply_function({ search: value });
    }, delay);
  }

  is_expanded(index: number) {
    return this.expanded_rows().has(index);
  }

  toggle_expanded(index: number) {
    this.expanded_rows.update((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }

  reset_expanded() {
    this.expanded_rows.set(new Set());
  }

  async scroll_table() {
    if (!this.fetch_on_scroll()) return;

    await on_scroll({
      element: document.documentElement,
      callback: async () => await this.fetch_on_scroll()!(),
      lock_scroll: this.lock_scroll(),
    });
  }
}
