import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ContentChild,
  input,
} from '@angular/core';
import { UiInput } from '../ui-input/ui-input';
import { FieldControllable } from '../../classes/field-controllable';

@Component({
  selector: 'ui-field',
  templateUrl: './ui-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiField implements AfterContentInit {
  readonly content = contentChild(FieldControllable);

  label = input.required<string>();
  id = input.required<string>();

  ngAfterContentInit() {
    if (this.content) {
      this.content()!.id = this.id();
    }
  }
}
