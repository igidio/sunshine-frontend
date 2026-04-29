import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ɵEmptyOutletComponent } from '@angular/router';

@Component({
  selector: 'ui-field',
  templateUrl: './ui-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiField {
  label = input.required<string>();
  id = input.required<string>();
}
