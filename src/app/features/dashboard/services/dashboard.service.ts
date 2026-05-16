import { menu_items, menuItemInterface } from '@/app/shared/data/menu';
import { Injectable, OnChanges, signal, SimpleChanges } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardService implements OnChanges {
  tree = signal<menuItemInterface[] | null>(null);
  reload = signal<(() => Promise<any>) | null>(null);
  is_reloading = signal(false);

  set_tree(menu_items: menuItemInterface[]) {
    this.tree.set(menu_items || null);
  }
  set_reload(fn: () => Promise<any>) {
    this.reload.set(fn || null);
  }

  unset_reload() {
    this.reload.set(null);
  }

  async on_reload() {
    if (!this.reload()) return;
    this.is_reloading.set(true);
    await this.reload()!();
    this.is_reloading.set(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
