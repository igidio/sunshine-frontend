import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-landing-products',
    templateUrl: './products.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingProductsPage { }
