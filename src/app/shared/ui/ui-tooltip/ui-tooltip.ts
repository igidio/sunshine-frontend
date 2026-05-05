import { AfterViewInit, ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { required } from '@angular/forms/signals';
import { initFlowbite, initTooltips } from 'flowbite';

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
