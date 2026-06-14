import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ChartsService } from '../../services/charts.service';
import type { ByPaymentMethodChartsInterface } from '../../interfaces/charts.interface';

@Component({
    selector: 'sales-by-payment-method',
    imports: [NgxEchartsDirective],
    templateUrl: './sales-by-payment-method.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesByPaymentMethod {
    chartsService = inject(ChartsService);

    options = computed(() => {
        const data: ByPaymentMethodChartsInterface[] | undefined = this.chartsService.data()?.sales?.by_payment_method;
        if (!data?.length) return null;

        return {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} Bs. ({d}%)',
            },
            legend: {
                bottom: '0%',
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
                    label: {
                        show: false,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 14,
                            fontWeight: 'bold',
                        },
                    },
                    data: data.map((d) => ({
                        name: d.payment_method,
                        value: +d.total,
                    })),
                },
            ],
        };
    });
}
