import { computed, Injectable, signal, TemplateRef } from '@angular/core';
import { Drawer } from 'flowbite';
import { UiSizes, UiVariants } from '../data/ui-types';

interface DrawerFooterButton {
  label: string;
  action: () => void | Promise<void>;
  variant: UiVariants;
  size: UiSizes;
}

interface DrawerHeaderProperties {
  title: string;
  show_close_button?: boolean;
  show_divider?: boolean;
}

interface DrawerSection<T = void> {
  template?: TemplateRef<any>;
  properties?: T;
}

interface DrawerOptions {
  header?: DrawerSection<DrawerHeaderProperties>;
  content?: Omit<DrawerSection, 'show_divider' | 'properties'>;
  footer?: DrawerSection<DrawerFooterButton[]>;
}

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  private drawer: Drawer | null = null;
  options = signal<DrawerOptions>({});

  register_drawer(drawer_instance: Drawer) {
    this.drawer = drawer_instance;
    this.drawer.isVisible();
    this.drawer.updateOnHide(() => console.log('Drawer closed'));
  }

  set_header(template: TemplateRef<any> | DrawerHeaderProperties) {
    if (template instanceof TemplateRef) {
      this.options.update((options) => ({
        ...options,
        header: {
          template,
        },
      }));
    } else {
      this.options.update((options) => ({
        ...options,
        header: {
          properties: template,
        },
      }));
    }
  }

  set_content(template: TemplateRef<any>) {
    this.options.update((options) => ({
      ...options,
      content: {
        template,
      },
    }));
  }

  set_footer(template: TemplateRef<any> | DrawerFooterButton[]) {
    if (template instanceof TemplateRef) {
      this.options.update((options) => ({
        ...options,
        footer: {
          template,
        },
      }));
    } else {
      this.options.update((options) => ({
        ...options,
        footer: {
          properties: template,
        },
      }));
    }
  }

  open() {
    if (this.drawer) {
      this.drawer.show();
    }
  }

  close() {
    if (this.drawer) {
      this.drawer.hide();
      this.options.set({} as DrawerOptions);
    }
  }

  toggle() {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }
  on_close() {
    if (this.drawer) this.drawer.updateOnHide(() => console.log('Drawer closed'));
  }

  show_header = computed(() => {
    return (
      !!this.options().header?.properties?.title ||
      !!this.options().header?.properties?.show_close_button ||
      !!this.options().header?.template
    );
  });

  show_content = computed(() => {
    return !!this.options().content?.template;
  });

  show_footer = computed(() => {
    return !!this.options().footer?.properties?.length || !!this.options().footer?.template;
  });
}
