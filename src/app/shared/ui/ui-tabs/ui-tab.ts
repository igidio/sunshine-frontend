import { Component, input, viewChild, TemplateRef } from '@angular/core';
import { IconValue } from '../../data/icons';

@Component({
  selector: 'ui-tab',
  template: '<ng-template><ng-content /></ng-template>',
})
export class UiTabComponent {
  id = input.required<string>();
  label = input.required<string>();
  icon = input<IconValue>();
  templateRef = viewChild.required(TemplateRef);
}
