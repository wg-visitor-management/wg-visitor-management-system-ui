import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'addTimezoneOffset' })
export class DateTimePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    const offset = 5.5 * 60 * 60 * 1000;
    const localTime = new Date(date.getTime() + offset);
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return localTime.toLocaleTimeString([], options);
  }
}
