import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

      return v.toString(16);

    });
  }

  cloneObject(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  convertTimeToMinutes(time: string) { //'04:00:00' -> 4
    return Math.floor(time.split(':').reduce(function (seconds, v) {
      return +v + seconds * 60;
    }, 0) / 60);
  }

  formatNumber(value: number): string {
    if (!value) {
      return '0';
    }

    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const suffixIndex = Math.floor(Math.log10(Math.abs(value)) / 3);
    const suffix = suffixes[suffixIndex];
    const scaled = value / Math.pow(10, suffixIndex * 3);

    return scaled.toFixed(1) + suffix;
  }
}
