import { computed, inject, Injectable, signal, TemplateRef } from '@angular/core';
import { Modal } from 'flowbite';
import { UiSizes, UiVariants } from '../data/ui-types';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ModalFooterButton {
  label: string;
  action: () => void;
  variant: UiVariants;
  size: UiSizes;
}
interface ModalHeaderProperties {
  title: string;
  show_close_button?: boolean;
}
interface ModalFooterProperties {
  right_buttons?: ModalFooterButton[];
  left_buttons?: ModalFooterButton[];
}

interface ModalSection<T = void> {
  template?: TemplateRef<any>;
  show_divider?: boolean;
  properties?: T;
}

interface ModalOptions {
  header?: ModalSection<ModalHeaderProperties>;
  content?: Omit<ModalSection, 'show_divider' | 'properties'>;
  footer?: ModalSection<ModalFooterProperties>;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modal: Modal | null = null;
  template = signal<TemplateRef<any> | null>(null);
  options = signal<ModalOptions>({});
  is_open = signal(false);

  closeOnNavigation = signal(false);

  constructor() {
    const router = inject(Router);
    router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        filter(() => this.is_open() && this.closeOnNavigation()),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.close();
      });
  }

  register_modal(modal_instance: Modal) {
    this.modal = modal_instance;
  }

  set_header(template: TemplateRef<any> | ModalHeaderProperties) {
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
  set_footer(template: TemplateRef<any> | ModalFooterProperties) {
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

  open({ close_on_navigation }: { close_on_navigation?: boolean } = {}) {
    this.closeOnNavigation.set(close_on_navigation ?? false);
    if (this.modal) {
      this.modal.show();
      this.is_open.set(true);
    }
  }
  close() {
    if (this.modal) {
      this.modal.hide();
      this.template.set(null);
      this.options.set({} as ModalOptions);
      this.is_open.set(false);
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

  show_footer = computed(() => {
    return (
      !!this.options().footer?.properties?.left_buttons?.length ||
      !!this.options().footer?.properties?.right_buttons?.length ||
      !!this.options().footer?.template
    );
  });
}
