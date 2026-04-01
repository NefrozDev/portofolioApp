import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'periodLabel',
  standalone: true
})
export class PeriodLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value?.trim()) {
      return 'Période non renseignée';
    }

    return value;
  }
}