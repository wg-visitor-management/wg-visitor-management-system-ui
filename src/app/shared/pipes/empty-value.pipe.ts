import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyValue'
})
export class EmptyValuePipe implements PipeTransform {
  transform(value: string): string {
    if (value === null || value === undefined || value === '') {
      return '\u00A0 \u00A0 \u00A0 - ';
    } else {
      return value;
    }
  }
}
