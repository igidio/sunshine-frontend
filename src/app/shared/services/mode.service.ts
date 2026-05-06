import { DOCUMENT, inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModeService {
  private document = inject(DOCUMENT);

  mode = signal<'light' | 'dark'>(this.get_initiol_mode());

  private get_initiol_mode(): 'light' | 'dark' {
    const stored_theme = localStorage.getItem('color-theme');
    if (stored_theme === 'light' || stored_theme === 'dark') {
      return stored_theme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  initialize() {
    if (
      localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.document.documentElement.classList.add('dark');
    } else {
      this.document.documentElement.classList.remove('dark');
    }
  }

  toggle(): void {
    const stored_theme = localStorage.getItem('color-theme');
    if (stored_theme) {
      if (stored_theme === 'light') {
        this.document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
        this.mode.set('dark');
      } else {
        this.document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
        this.mode.set('light');
      }
    } else {
      if (this.document.documentElement.classList.contains('dark')) {
        this.document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
        this.mode.set('light');
      } else {
        this.document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
        this.mode.set('dark');
      }
    }
  }
}
