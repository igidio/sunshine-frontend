import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LandingHero } from '../../components/landing-hero/landing-hero';
import { LandingProducts } from '../../components/landing-products/landing-products';
import { LandingAbout } from '../../components/landing-about/landing-about';
import { LandingLocation } from '../../components/landing-location/landing-location';
import { LandingCta } from '../../components/landing-cta/landing-cta';

@Component({
  selector: 'app-landing-main',
  imports: [LandingHero, LandingProducts, LandingAbout, LandingLocation, LandingCta],
  templateUrl: './main.html',
  styleUrl: './main.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingMain { }
