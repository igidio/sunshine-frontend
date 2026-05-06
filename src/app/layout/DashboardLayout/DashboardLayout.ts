import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiMode } from '@/app/shared/ui/ui-mode/ui-mode';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, UiMode],
  templateUrl: './DashboardLayout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardLayout {}
