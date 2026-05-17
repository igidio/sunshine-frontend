import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgComponentOutlet } from '@angular/common';
import { TableField } from './ui-table_helper';

@Component({
  selector: 'ui-table',
  imports: [NgComponentOutlet],
  templateUrl: './ui-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTable<T> {
  data = input.required<T[]>();
  fields = input.required<TableField<T, any>[]>();
}
