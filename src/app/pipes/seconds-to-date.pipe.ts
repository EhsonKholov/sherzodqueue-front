import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'secondsToDate',
  standalone: true
})
export class SecondsToDatePipe implements PipeTransform {

  transform(seconds: any): string {
    //if (isNaN(seconds)) { return 'Неверные данные' }
    if (!seconds) { return '' }

    let date: any = new Date(seconds),
        options: any

    let today = new Date()

    let start = Math.floor(today.getTime() / (3600 * 24 * 1000));
    let end = Math.floor(date.getTime() / (3600 * 24 * 1000));
    let daysDiff = end - start;

    if (daysDiff == 0) {
      return `Сегодня в ${moment(date).format('HH:mm')}`
    } else if (daysDiff == 1) {
      return `Завтра в ${moment(date).format('HH:mm')}`
    } else if (daysDiff == -1) {
      return `Вчера в ${moment(date).format('HH:mm')}`
    }

    try {
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()

      if (hour === 0 && minute === 0 && second === 0) {
        options = { year: 'numeric', month: 'long', day: 'numeric' }
        return date.toLocaleDateString('ru-RU', options)
      } else {
        options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          //second: 'numeric'
        }
      }
    } catch (e: any) {}

    return date.toLocaleDateString('ru-RU', options);
  }

}
