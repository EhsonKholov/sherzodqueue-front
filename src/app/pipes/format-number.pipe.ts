import {Pipe, PipeTransform} from '@angular/core';
import {UtilsService} from '../services/utils.service';

@Pipe({
  name: 'formatNumber',
  standalone: true
})
export class FormatNumberPipe implements PipeTransform {

  constructor(private utils: UtilsService) {
  }

  transform(value: number): string {
    return this.utils.formatNumber(value)
  }

}
