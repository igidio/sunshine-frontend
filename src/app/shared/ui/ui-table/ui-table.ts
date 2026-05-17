import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { NgComponentOutlet, NgClass } from '@angular/common';
import { TableField } from './ui-table_helper';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ui-table',
  imports: [NgComponentOutlet, NgClass],
  templateUrl: './ui-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTable<T> {
  router = inject(Router);
  route = inject(ActivatedRoute);
  sortable = input<Array<keyof T>>([]);
  data = input.required<T[]>();
  fields = input.required<TableField<T, any>[]>();

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
}
