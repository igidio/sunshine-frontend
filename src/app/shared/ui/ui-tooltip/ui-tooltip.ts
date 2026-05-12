import { AfterViewInit, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { initTooltips } from 'flowbite';

@Component({
  selector: 'ui-tooltip',
  imports: [],
  templateUrl: './ui-tooltip.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTooltip implements AfterViewInit {
  _id = input.required<string>();
  _label = input<string | null>();

  ngAfterViewInit() {
    initTooltips();
  }
}
