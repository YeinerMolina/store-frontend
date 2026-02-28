import { Pipe, PipeTransform } from '@angular/core';

import { formatCurrencyCOP } from '@retail/shared/util';

@Pipe({
  name: 'currencyCop',
  standalone: true,
})
export class CurrencyCopPipe implements PipeTransform {
  transform(value: number): string {
    return formatCurrencyCOP(value);
  }
}
