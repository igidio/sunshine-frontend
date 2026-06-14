import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiIcon } from '../../../../shared/ui/ui-icon/ui-icon';
import { UiLogo } from '../../../../shared/ui/ui-logo/ui-logo';

@Component({
  selector: 'main-footer',
  imports: [RouterLink, UiIcon, UiLogo],
  templateUrl: './main-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainFooter {
  get current_year(): number {
    return new Date().getFullYear();
  }
}
