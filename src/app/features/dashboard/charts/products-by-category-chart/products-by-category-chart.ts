import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ChartsService } from '../../services/charts.service';
import type { ProductsByCategoryChartsInterface } from '../../interfaces/charts.interface';

@Component({
    selector: 'products-by-category-chart',
    imports: [NgxEchartsDirective],
    templateUrl: './products-by-category-chart.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsByCategoryChart {
    chartsService = inject(ChartsService);

    options = computed(() => {
        const data: ProductsByCategoryChartsInterface[] | undefined =
            this.chartsService.data()?.catalog?.products_by_category;
        if (!data?.length) return null;

        return {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)',
            },
            legend: {
                bottom: '0%',
                type: 'scroll',
            },
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: true,
                    itemStyle: {
                        borderRadius: 6,
                        borderColor: 'transparent',
                        borderWidth: 2,
                    },
                    label: { show: false },
                    emphasis: {
                        label: { show: true, fontSize: 14, fontWeight: 'bold' },
                    },
                    data: data.map((d) => ({
                        name: d.category_name,
                        value: d.total,
                    })),
                },
            ],
        };
    });
}
