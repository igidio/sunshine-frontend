import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ChartsService } from '../../services/charts.service';
import type { AppointmentWeekInterface } from '../../interfaces/charts.interface';

function toMinutes(time: string): number {
    const parts = time.split(':');
    return +parts[0] * 60 + (+parts[1] || 0);
}

@Component({
    selector: 'week-appointments-chart',
    imports: [NgxEchartsDirective],
    templateUrl: './week-appointments-chart.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekAppointmentsChart {
    chartsService = inject(ChartsService);

    options = computed(() => {
        const data: AppointmentWeekInterface[] | undefined =
            this.chartsService.data()?.appointments?.this_week;
        if (!data?.length) return null;

        const labels = data.map(
            (a) => `${a.first_name} ${a.last_name} — ${a.treatment_name}`
        );

        const spacerData = data.map((a) => toMinutes(a.time_start));
        const durationData = data.map((a) => {
            const start = toMinutes(a.time_start);
            const end = toMinutes(a.time_end);
            return Math.max(end - start, 15);
        });

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: (params: any) => {
                    const idx = params[0]?.dataIndex ?? -1;
                    const app = data[idx];
                    if (!app) return '';
                    const start = app.time_start.slice(0, 5);
                    const end = app.time_end.slice(0, 5);
                    const date = new Date(app.date + 'T00:00:00').toLocaleDateString('es', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                    });
                    return `<b>${app.first_name} ${app.last_name}</b><br/>
            ${app.treatment_name}<br/>
            ${date} · ${start} — ${end}`;
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
                min: 0,
                max: 1440,
                axisLabel: {
                    formatter: (v: number) => {
                        const h = Math.floor(v / 60);
                        const m = v % 60;
                        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                    },
                },
            },
            yAxis: {
                type: 'category',
                data: labels,
                axisLabel: { fontSize: 11 },
            },
            series: [
                {
                    name: '',
                    type: 'bar',
                    stack: 'gantt',
                    data: spacerData,
                    itemStyle: { color: 'transparent' },
                    emphasis: { itemStyle: { color: 'transparent' } },
                },
                {
                    name: 'Duración',
                    type: 'bar',
                    stack: 'gantt',
                    data: durationData,
                    itemStyle: {
                        borderRadius: [0, 4, 4, 0],
                        color: '#00a8ff',
                    },
                },
            ],
        };
    });
}
