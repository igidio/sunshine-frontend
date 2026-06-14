import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { UiIcon } from "@/app/shared/ui/ui-icon/ui-icon";

@Component({
  selector: 'landing-about',
  imports: [ScrollRevealDirective, UiIcon],
  templateUrl: './landing-about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingAbout { }
