import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ui-pagination',
  imports: [UiIcon, NgClass],
  templateUrl: './ui-pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiPagination {
  current_page = input<number>(3);
  total_pages = input<number>(10);
  pages_to_show = input<number>(this.total_pages());
  show_first_last = input(false);
  show_prev_next = input(true);

  get pages_to_show_array() {
    const total = Math.max(1, this.total_pages());
    const count = Math.max(1, this.pages_to_show());
    const current = Math.min(Math.max(1, this.current_page()), total);

    if (total <= count) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const half = Math.floor(count / 2);
    let start = current - half;
    let end = start + count - 1;

    if (start < 1) {
      start = 1;
      end = count;
    }

    if (end > total) {
      end = total;
      start = total - count + 1;
    }

    return Array.from({ length: count }, (_, i) => start + i);
  }

  go_to_page(page: number) {}
}
