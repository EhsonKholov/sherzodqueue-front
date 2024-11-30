import { Injectable } from '@angular/core';

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
    return Math.floor(time.split (':').reduce (function (seconds, v) {
      return +v + seconds * 60;
    }, 0) / 60);
  }
}
