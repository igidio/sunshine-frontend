import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { NgComponentOutlet, NgClass } from '@angular/common';
import { TableField } from './ui-table_helper';
import { ActivatedRoute, Router } from '@angular/router';
import { UiButton } from '../ui-button/ui-button';
import { UiIcon } from '../ui-icon/ui-icon';

@Component({
  selector: 'ui-table',
  imports: [NgComponentOutlet, NgClass, UiButton, UiIcon],
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

  apply_conditions(Object: any) {
    this.router.navigate([], {
      queryParams: Object,
      queryParamsHandling: 'merge',
    });
  }
}
