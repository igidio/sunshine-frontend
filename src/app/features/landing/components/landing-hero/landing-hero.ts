import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { UiLogo } from "@/app/shared/ui/ui-logo/ui-logo";
import { UiButton } from "@/app/shared/ui/ui-button/ui-button";
import { UiIcon } from "@/app/shared/ui/ui-icon/ui-icon";

@Component({
  selector: 'landing-hero',
  imports: [RouterLink, ScrollRevealDirective, UiLogo, UiButton, UiIcon],
  templateUrl: './landing-hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingHero { }
