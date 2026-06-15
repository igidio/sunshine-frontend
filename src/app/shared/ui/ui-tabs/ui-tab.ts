import { Component, input, viewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'ui-tab',
  template: '<ng-template><ng-content /></ng-template>',
})
export class UiTabComponent {
  id = input.required<string>();
  label = input.required<string>();
  icon = input<string>();
  templateRef = viewChild.required(TemplateRef);
}
