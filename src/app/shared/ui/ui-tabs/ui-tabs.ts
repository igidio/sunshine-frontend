import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, afterNextRender, DOCUMENT, contentChildren, ElementRef } from '@angular/core';
import { TabItem, Tabs } from 'flowbite';
import { UiTabComponent } from './ui-tab';

@Component({
  selector: 'ui-tabs',
  imports: [NgTemplateOutlet],
  templateUrl: './ui-tabs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTabs {
  document_ob = inject(DOCUMENT);
  tabs = contentChildren(UiTabComponent)

  private tabs_instance: Tabs | null = null;

  constructor() {
    afterNextRender(() => {
      this.initTabs();
    });
  }

  private initTabs(): void {
    const tabs_element = this.document_ob.getElementById('tabs');

    if (!tabs_element) return;

    const tab_elements: TabItem[] = this.tabs().map(tab => ({
      id: tab.id(),
      triggerEl: this.document_ob.querySelector(`#${tab.id()}-tab-trigger`)!,
      targetEl: this.document_ob.querySelector(`#${tab.id()}-tab-target`)!,
    }));

    const options = {
      defaultTabId: 'settings',
      activeClasses: 'text-fg-brand hover:text-fg-brand border-brand',
      inactiveClasses: 'text-body hover:text-fg-brand border-base hover:border-brand',
    };

    const instanceOptions = {
      id: 'tabs',
      override: true,
    };

    this.tabs_instance = new Tabs(tabs_element, tab_elements, options, instanceOptions);
    this.tabs_instance.show('profile');
  }
}
