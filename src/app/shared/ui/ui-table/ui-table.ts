import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { NgComponentOutlet, NgClass, JsonPipe } from '@angular/common';
import { TableField } from './ui-table_helper';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { UiButton } from '../ui-button/ui-button';
import { UiIcon } from '../ui-icon/ui-icon';
import { UiDropdown } from '../ui-dropdown/ui-dropdown';
import { UiBadge } from '../ui-badge/ui-badge';
import { UiPagination } from '../ui-pagination/ui-pagination';

interface FilterBy {
  name: string;
  label: string;
  options: { label: string; value: any }[];
}

@Component({
  selector: 'ui-table',
  imports: [NgComponentOutlet, NgClass, UiBadge, UiButton, UiIcon, UiDropdown, UiPagination],
  templateUrl: './ui-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTable<T> {
  router = inject(Router);
  route = inject(ActivatedRoute);
  sortable = input<Array<keyof T>>([]);
  data = input.required<T[]>();
  fields = input.required<TableField<T, any>[]>();
  limits = input<number[] | null>(null);
  search = input(false, {
    transform: booleanAttribute,
  });
  pagination = input(false, {
    transform: booleanAttribute,
  });
  filters = input<FilterBy[] | null>(null);
  search_ref = viewChild<ElementRef>('search_input');

  query_params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  query_params_object = computed(() =>
    Object.fromEntries(
      this.query_params().keys.map((key) => [key, this.query_params().getAll(key)]),
    ),
  );

  ngAfterViewInit() {
    if (this.query_params_object()['search'][0]) {
      const searchEl = this.search_ref();
      if (searchEl) {
        searchEl.nativeElement.value = this.query_params_object()['search'][0];
      }
    }
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

    this.router.navigate([], {
      queryParams: { sort_by: order && name, order },
      queryParamsHandling: 'merge',
    });
  };

  private search_timer: ReturnType<typeof setTimeout> | null = null;

  apply_function(object: Object) {
    this.router.navigate([], {
      queryParams: object,
      queryParamsHandling: 'merge',
    });
  }

  apply_conditions(object: Object) {
    this.apply_function(object);
  }

  apply_filter(filter_name: string, value: any) {
    this.apply_function({ [filter_name]: value });
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
}
