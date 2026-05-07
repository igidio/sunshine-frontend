import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { initDropdowns } from 'flowbite';

@Component({
  selector: 'ui-dropdown',
  imports: [],
  templateUrl: './ui-dropdown.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDropdown {
  _id = input.required<string>();

  ngAfterViewInit() {
    initDropdowns();
  }
}
