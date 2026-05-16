import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { Dropdown, DropdownInterface, DropdownOptions, initDropdowns } from 'flowbite';
import { UiDropdownItem } from '../../data/ui-types';
import { UiBadge } from '../ui-badge/ui-badge';
import { UiIcon } from '../ui-icon/ui-icon';
import { Router, RouterLink } from '@angular/router';

type UiDropdownPlacement =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end';

@Component({
  selector: 'ui-dropdown',
  imports: [UiBadge, UiIcon],
  templateUrl: './ui-dropdown.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDropdown implements OnDestroy {
  router = inject(Router);

  _id = input.required<string>();
  trigger = input<'hover' | 'click'>('click');
  delay = input(300);
  placement = input<UiDropdownPlacement | null>();
  distance = input<number | null>();
  skidding = input<number | null>();
  items = input<UiDropdownItem[][]>([]);
  on_open = output<void>();

  trigger_el = viewChild.required<ElementRef<HTMLElement>>('trigger_el');
  target_el = viewChild.required<ElementRef<HTMLElement>>('target_el');
  private dropdown: DropdownInterface | null = null;

  constructor() {
    afterNextRender(() => {
      const targetElement = this.target_el().nativeElement;
      const triggerElement = this.trigger_el().nativeElement;

      const options: DropdownOptions = {
        placement: this.placement() ?? 'bottom',
        triggerType: this.trigger(),
        offsetSkidding: this.skidding() ?? 0,
        offsetDistance: this.distance() ?? 10,
        delay: this.delay(),
        onShow: () => {
          this.on_open.emit();
        },
      };

      this.dropdown = new Dropdown(targetElement, triggerElement, options);
    });
  }

  ngAfterViewInit() {
    initDropdowns();
  }

  ngOnDestroy() {
    if (this.dropdown) {
      this.dropdown.destroy();
    }
  }

  show() {
    this.dropdown?.show();
  }

  hide() {
    this.dropdown?.hide();
  }

  toggle() {
    this.dropdown?.toggle();
  }
}
