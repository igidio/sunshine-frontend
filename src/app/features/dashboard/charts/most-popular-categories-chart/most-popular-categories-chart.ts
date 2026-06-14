import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ChartsService } from '../../services/charts.service';
import type { MostPopularCategoryChartsInterface } from '../../interfaces/charts.interface';

@Component({
    selector: 'most-popular-categories-chart',
    imports: [NgxEchartsDirective],
    templateUrl: './most-popular-categories-chart.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MostPopularCategoriesChart {
    chartsService = inject(ChartsService);

    options = computed(() => {
        const data: MostPopularCategoryChartsInterface[] | undefined =
            this.chartsService.data()?.catalog?.most_popular_categories;
        if (!data?.length) return null;

        const sorted = [...data].sort((a, b) => a.product_count - b.product_count);

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: (params: any) => {
                    const item = params[0];
                    if (!item) return '';
                    const d = sorted[item.dataIndex];
                    return `<b>${d.category_name}</b><br/>Productos: <b>${d.product_count}</b>`;
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
                    data: sorted.map((d) => d.product_count),
                },
            ],
        };
    });
}
