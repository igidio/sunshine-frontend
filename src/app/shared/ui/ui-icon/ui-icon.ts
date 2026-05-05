import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  input,
  Signal,
  signal,
} from '@angular/core';
import { available_icons, IconValue } from '../../data/icons';
import { NgClass } from '@angular/common';
import { UiSizes } from '../../data/ui-types';

@Component({
  selector: 'ui-icon',
  //imports: [NgClass],
  templateUrl: './ui-icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class UiIcon {
  icon = input.required<IconValue>();
  size = input<UiSizes>('md');
  available_icons = available_icons;

  get text_size() {
    return `text-${this.size()}`;
  }
}
