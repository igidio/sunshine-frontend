import { computed, Injectable, signal, TemplateRef } from '@angular/core';
import { Drawer } from 'flowbite';

interface DrawerHeaderProperties {
  title: string;
  show_close_button?: boolean;
}

interface DrawerSection<T = void> {
  template?: TemplateRef<any>;
  show_divider?: boolean;
  properties?: T;
}

interface DrawerOptions {
  header?: DrawerSection<DrawerHeaderProperties>;
  content?: Omit<DrawerSection, 'show_divider' | 'properties'>;
}

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  private drawer: Drawer | null = null;
  options = signal<DrawerOptions>({});

  register_drawer(drawer_instance: Drawer) {
    this.drawer = drawer_instance;
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
}
