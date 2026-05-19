import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ui-pagination',
  imports: [UiIcon, NgClass],
  templateUrl: './ui-pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiPagination {
  current_page = input<number>(1);
  total_items = input<number>(0);
  items_per_page = input<number>(10);
  max_pages_to_show = input<number>(5);
  show_first_last = input(false);
  show_prev_next = input(true);

  page_change = output<number>();

  total_pages = computed(() => {
    return Math.ceil(this.total_items() / this.items_per_page()) || 1;
  });
  offset = computed(() => {
    return (this.current_page() - 1) * this.items_per_page();
  });

  pages_to_show_array = computed(() => {
    const total = this.total_pages();
    const current = this.current_page();
    const max_visible = this.max_pages_to_show();
    if (total <= max_visible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    let half = Math.floor(max_visible / 2);
    let start = current - half;
    let end = start + max_visible - 1;
    if (start < 1) {
      start = 1;
      end = max_visible;
    }
    if (end > total) {
      end = total;
      start = total - max_visible + 1;
    }

    return Array.from({ length: max_visible }, (_, i) => start + i);
  });

  go_to_page(page: number) {
    console.log(page);

    if (page >= 1 && page <= this.total_pages() && page !== this.current_page()) {
      this.page_change.emit(page);
    }
  }
}
