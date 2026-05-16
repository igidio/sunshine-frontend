import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeago',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';
    const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
    if (seconds < 29) return 'Justo ahora';
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };
    const labels = {
      year: {
        singular: 'año',
        plural: 'años',
      },
      month: {
        singular: 'mes',
        plural: 'meses',
      },
      week: {
        singular: 'semana',
        plural: 'semanas',
      },
      day: {
        singular: 'día',
        plural: 'días',
      },
      hour: {
        singular: 'hora',
        plural: 'horas',
      },
      minute: {
        singular: 'minuto',
        plural: 'minutos',
      },
      second: {
        singular: 'segundo',
        plural: 'segundos',
      },
    } as const;
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const counter = Math.floor(seconds / secondsInUnit);
      if (counter > 0) {
        const label = labels[unit as keyof typeof labels];
        return `hace ${counter} ${counter === 1 ? label.singular : label.plural}`;
      }
    }
    return '';
  }
}
