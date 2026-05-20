import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Drawer, DrawerOptions, initDrawers } from 'flowbite';
import { DrawerService } from '../../services/drawer.service';
import { UiButton } from '../ui-button/ui-button';
import { UiIcon } from '../ui-icon/ui-icon';

@Component({
  selector: 'ui-drawer',
  templateUrl: './ui-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, UiButton, NgClass],
})
export class UiDrawer implements AfterViewInit {
  public drawer_service = inject(DrawerService);
  drawer_ref = viewChild<ElementRef>('drawer');

  constructor() {
    initDrawers();
  }

  ngAfterViewInit() {
    const native_element = this.drawer_ref()?.nativeElement;

    if (native_element) {
      const drawer = new Drawer(native_element, {
        placement: 'right',
      });
      this.drawer_service.register_drawer(drawer);
    }
  }
}
