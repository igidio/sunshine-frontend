import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { UiButton } from "@/app/shared/ui/ui-button/ui-button";
import { UiIcon } from "@/app/shared/ui/ui-icon/ui-icon";
import { ProductItem } from "../product-item/product-item";

@Component({
  selector: 'landing-products',
  imports: [RouterLink, ScrollRevealDirective, UiButton, UiIcon, ProductItem],
  templateUrl: './landing-products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingProducts { }
