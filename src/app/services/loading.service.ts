import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  count = signal(0);
  loading = signal('');

  decrCount () {
    this.count.update(val => val - 1)
    return this.count();
  }

  incrCount () {
    this.count.update(val => val + 1)
    return this.count();
  }

  requestStarted() {
    if (this.incrCount() === 1) {
      this.loading.set('start')
    }
  }

  requestEnded() {
    if (this.count() === 0 || this.decrCount() === 0) {
      this.loading.set('stop')
    }
  }

  resetSpinner() {
    this.count.set(0)
    this.loading.set('stop')
  }
}
