import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToDate',
  standalone: true
})
export class SecondsToDatePipe implements PipeTransform {

  transform(seconds: any): string {
    //if (isNaN(seconds)) { return 'Неверные данные' }
    if (!seconds) { return '' }

    seconds = new Date(seconds)
    let date: any, options: any
    try {
      seconds = seconds.getTime()

      date = new Date(seconds)
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
          second: 'numeric'
        }
      }
    } catch (e: any) {}

    return date.toLocaleDateString('ru-RU', options);
  }

}
