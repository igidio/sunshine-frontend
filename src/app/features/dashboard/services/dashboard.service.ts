import { menu_items, menuItemInterface } from '@/app/shared/data/menu';
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor() {}

  tree = signal<menuItemInterface[] | null>(null);

  set_tree(menu_items: menuItemInterface[]) {
    this.tree.set(menu_items || null);
  }
}
