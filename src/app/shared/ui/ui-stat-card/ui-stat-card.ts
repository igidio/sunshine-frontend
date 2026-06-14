import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { IconValue } from '../../data/icons';
import { UiCard } from '../ui-card/ui-card';
import { UiIcon } from '../ui-icon/ui-icon';

@Component({
    selector: 'ui-stat-card',
    imports: [UiCard, UiIcon],
    templateUrl: './ui-stat-card.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiStatCard {
    label = input.required<string>();
    icon = input.required<IconValue>();
    value = input<string | number | null>(null);
}
