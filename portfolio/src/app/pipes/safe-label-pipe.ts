import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeLabel',
  standalone: true
})
export class SafeLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value?.trim()) {
      return '—';
    }

    return value.trim();
  }
}