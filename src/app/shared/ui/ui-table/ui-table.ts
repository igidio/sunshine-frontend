import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { NgComponentOutlet, NgClass, JsonPipe } from '@angular/common';
import { TableField } from './ui-table_helper';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { UiButton } from '../ui-button/ui-button';
import { UiIcon } from '../ui-icon/ui-icon';
import { UiDropdown } from '../ui-dropdown/ui-dropdown';
import { UiBadge } from '../ui-badge/ui-badge';

interface FilterBy {
  name: string;
  label: string;
  options: { label: string; value: any }[];
}

@Component({
  selector: 'ui-table',
  imports: [NgComponentOutlet, NgClass, UiBadge, UiButton, UiIcon, UiDropdown, JsonPipe],
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
  filters = input<FilterBy[] | null>(null);

  query_params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  query_params_object = computed(() =>
    Object.fromEntries(
      this.query_params().keys.map((key) => [key, this.query_params().getAll(key)]),
    ),
  );

  sort_by = (name?: keyof T) => {
    if (!name || !this.sortable().includes(name)) return;
    let order: 'asc' | 'desc' | null = null;
    const current_order = this.route.snapshot.queryParamMap.get('order');
    order = current_order === 'asc' ? 'desc' : current_order === 'desc' ? null : 'asc';

    this.router.navigate([], {
      queryParams: { sort_by: order && name, order },
      queryParamsHandling: 'merge',
    });
  };

  apply_conditions(object: Object) {
    this.router.navigate([], {
      queryParams: object,
      queryParamsHandling: 'merge',
    });
  }

  apply_filter(filter_name: string, value: any) {
    console.log(filter_name, value);

    this.router.navigate([], {
      queryParams: { [filter_name]: value },
      queryParamsHandling: 'merge',
    });
  }
}
