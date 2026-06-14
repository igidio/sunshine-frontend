import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-landing-profile',
    templateUrl: './profile.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingProfile { }
