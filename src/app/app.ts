import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { UiToast } from './shared/ui/ui-toast/ui-toast';
import { UiModal } from './shared/ui/ui-modal/ui-modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet, UiToast, UiModal],
})
export class App {
  protected readonly title = signal('sunshine-frontend');

  constructor() {
    initFlowbite();
  }
}
