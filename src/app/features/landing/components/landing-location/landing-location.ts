import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { UiIcon } from "@/app/shared/ui/ui-icon/ui-icon";

@Component({
  selector: 'landing-location',
  imports: [ScrollRevealDirective, UiIcon],
  templateUrl: './landing-location.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingLocation {
  private readonly _sanitizer = inject(DomSanitizer);

  readonly lat = input(-16.5141762695206);
  readonly lng = input(-68.13111446171077);

  readonly google_maps_url = computed(() => {
    const lat = this.lat();
    const lng = this.lng();
    const url = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  });
}
