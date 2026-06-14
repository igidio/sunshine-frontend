import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ChartsService } from '../../services/charts.service';
import type { AveragePriceByCategoryChartsInterface } from '../../interfaces/charts.interface';

@Component({
    selector: 'avg-price-by-category-chart',
    imports: [NgxEchartsDirective],
    templateUrl: './avg-price-by-category-chart.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvgPriceByCategoryChart {
    chartsService = inject(ChartsService);

    options = computed(() => {
        const data: AveragePriceByCategoryChartsInterface[] | undefined =
            this.chartsService.data()?.catalog?.average_price_by_category;
        if (!data?.length) return null;

        const sorted = [...data].sort((a, b) => a.average_price - b.average_price);
        const globalAvg =
            sorted.reduce((sum, d) => sum + d.average_price, 0) / sorted.length;

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: (params: any) => {
                    const item = params[0];
                    if (!item) return '';
                    const d = sorted[item.dataIndex];
                    return `<b>${d.category_name}</b><br/>Precio promedio: <b>${d.average_price.toFixed(2)} Bs.</b>`;
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: {
                type: 'value',
            },
            yAxis: {
                type: 'category',
                data: sorted.map((d) => d.category_name),
            },
            series: [
                {
                    type: 'bar',
                    data: sorted.map((d) => +d.average_price.toFixed(2)),
                    markLine: {
                        silent: true,
                        data: [
                            {
                                type: 'average',
                                name: 'Promedio Global',
                                label: {
                                    formatter: 'Promedio: {c} Bs.',
                                },
                            },
                        ],
                    },
                },
            ],
        };
    });
}
