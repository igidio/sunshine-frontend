import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-landing-orders',
    templateUrl: './orders.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingOrders { }
