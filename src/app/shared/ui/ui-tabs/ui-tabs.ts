import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, afterNextRender, DOCUMENT, contentChildren, ElementRef, booleanAttribute } from '@angular/core';
import { TabItem, Tabs, TabsOptions } from 'flowbite';
import { UiTabComponent } from './ui-tab';
import { UiIcon } from "../ui-icon/ui-icon";

@Component({
  selector: 'ui-tabs',
  imports: [NgTemplateOutlet, NgClass, UiIcon],
  templateUrl: './ui-tabs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTabs {
  document_ob = inject(DOCUMENT);
  tabs = contentChildren(UiTabComponent)
  vertical = input(false, {
    transform: booleanAttribute
  });
  button_type = input<'underline' | 'default' | 'pill'>('default');

  tabs_instance: Tabs | null = null;

  constructor() {
    afterNextRender(() => {
      this.initTabs();
    });
  }

  get active_classes() {
    switch (this.button_type()) {
      case 'underline':
        return 'text-fg-brand! bg-neutral-secondary-soft!';
      case 'pill':
        return 'bg-brand text-white! hover:text-white!';
      default:
        return 'bg-neutral-secondary-soft!';
    }
  }

  get inactive_classes() {
    switch (this.button_type()) {
      case 'underline':
        return 'border-transparent hover:text-fg-brand hover:border-brand';
      case 'pill':
        return 'hover:text-heading! hover:bg-neutral-secondary-soft!';
      default:
        return 'hover:text-heading! hover:bg-neutral-secondary-soft!';
    }
  }

  private initTabs(): void {
    const tabs_element = this.document_ob.getElementById('tabs');

    if (!tabs_element) return;

    const tab_elements: TabItem[] = this.tabs().map(tab => ({
      id: tab.id(),
      triggerEl: this.document_ob.querySelector(`#${tab.id()}-tab-trigger`)!,
      targetEl: this.document_ob.querySelector(`#${tab.id()}-tab-target`)!,
    }));

    const options: TabsOptions = {
      defaultTabId: 'profile',
      activeClasses: this.active_classes,
      inactiveClasses: this.inactive_classes + ' hover:cursor-pointer',
    };

    const instance_options = {
      id: 'tabs',
      override: true,
    };

    this.tabs_instance = new Tabs(tabs_element, tab_elements, options, instance_options);

  }
}
