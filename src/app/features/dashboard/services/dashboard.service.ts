import { menu_items, menuItemInterface } from '@/app/shared/data/menu';
import { Injectable, OnChanges, signal, SimpleChanges } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardService implements OnChanges {
  constructor() {
    console.log('holaaa');
  }

  tree = signal<menuItemInterface[] | null>(null);
  reload = signal<Function | null>(null);

  set_tree(menu_items: menuItemInterface[]) {
    this.tree.set(menu_items || null);
  }
  set_reload(fn: Function) {
    this.reload.set(fn || null);
  }

  unset_reload() {
    this.reload.set(null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
