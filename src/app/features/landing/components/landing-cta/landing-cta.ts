import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { UiButton } from "@/app/shared/ui/ui-button/ui-button";
import { UiIcon } from "@/app/shared/ui/ui-icon/ui-icon";

@Component({
  selector: 'landing-cta',
  imports: [RouterLink, ScrollRevealDirective, UiButton, UiIcon],
  templateUrl: './landing-cta.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingCta { }
