import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ChartsService } from '../../services/charts.service';
import type { TrendChartsInterface } from '../../interfaces/charts.interface';

@Component({
    selector: 'sales-trend-chart',
    imports: [NgxEchartsDirective],
    templateUrl: './sales-trend-chart.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesTrendChart {
    chartsService = inject(ChartsService);

    options = computed(() => {
        const trend: TrendChartsInterface[] | undefined = this.chartsService.data()?.sales?.trend;
        if (!trend?.length) return null;

        return {
            tooltip: {
                trigger: 'axis',
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: trend.map((t) => {
                    const d = new Date(t.date);
                    return d.toLocaleDateString('es', { day: '2-digit', month: 'short' });
                }),
                boundaryGap: false,
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    type: 'line',
                    data: trend.map((t) => +t.total),
                    smooth: true,
                    areaStyle: {},
                    showSymbol: false,
                },
            ],
        };
    });
}
