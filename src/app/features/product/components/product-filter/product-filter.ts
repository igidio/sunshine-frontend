import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'product-filter',
  imports: [],
  templateUrl: './product-filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilter {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  query_params = toSignal(this.route.queryParams, {
    initialValue: this.route.snapshot.queryParams,
  });

  min_price = signal<string>('');
  max_price = signal<string>('');
  min_stock = signal<string>('');
  max_stock = signal<string>('');

  constructor() {
    const initial = this.route.snapshot.queryParams;

    if (initial['min_price']) this.min_price.set(initial['min_price']);
    if (initial['max_price']) this.max_price.set(initial['max_price']);
    if (initial['min_stock']) this.min_stock.set(initial['min_stock']);
    if (initial['max_stock']) this.max_stock.set(initial['max_stock']);
  }

  on_min_price_input(event: Event) {
    this.min_price.set((event.target as HTMLInputElement).value);
    this.apply_filters();
  }

  on_max_price_input(event: Event) {
    this.max_price.set((event.target as HTMLInputElement).value);
    this.apply_filters();
  }

  on_min_stock_input(event: Event) {
    this.min_stock.set((event.target as HTMLInputElement).value);
    this.apply_filters();
  }

  on_max_stock_input(event: Event) {
    this.max_stock.set((event.target as HTMLInputElement).value);
    this.apply_filters();
  }

  private apply_filters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        min_price: this.min_price() || null,
        max_price: this.max_price() || null,
        min_stock: this.min_stock() || null,
        max_stock: this.max_stock() || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
