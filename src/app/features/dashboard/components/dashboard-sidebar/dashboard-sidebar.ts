import { IconValue } from '@/app/shared/data/icons';
import { AfterViewInit, ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { UiIcon } from '@/app/shared/ui/ui-icon/ui-icon';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { menu_items } from '@/app/shared/data/menu';
import { NgClass } from '@angular/common';

@Component({
  selector: 'dashboard-sidebar',
  imports: [UiIcon, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .fade-in {
      animation: fadeIn 0.2s ease-in;
    }
    .fade-out {
      animation: fadeOut 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `,
})
export class DashboardSidebar implements AfterViewInit {
  collapse_sidebar = input.required<boolean>();
  items = [
    menu_items.home,
    menu_items.appointment,
    menu_items.supplier,
    menu_items.product,
    menu_items.stock,
    menu_items.user,
    menu_items.customer,
    menu_items.treatment,
    menu_items.sale,
  ];
  items_end = [menu_items.profile];

  ngAfterViewInit() {
    initFlowbite();
  }
}
