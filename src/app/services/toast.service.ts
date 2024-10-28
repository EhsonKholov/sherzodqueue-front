import {Injectable, NgZone, signal, WritableSignal} from '@angular/core';
import {UtilsService} from './utils.service';
import {Toast} from '../models/Toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: WritableSignal<Toast[]> = signal([])
  inactivityTime = 3

  constructor(private ngZone: NgZone, private utils: UtilsService) {
    this.runCheckToasts()
  }

  default(message: string) {
    this.createToast(message)
  }

  success(message: string) {
    this.createToast(message, 'success')
  }

  warning(message: string) {
    this.createToast(message, 'warning')
  }

  error(message: string) {
    this.createToast(message, 'error')
  }

  createToast(message: string, flag?: 'success' | 'error' | 'warning'): void {
    let toast: Toast = {
      id: this.utils.generateUUID(),
      message: message,
      flag: flag,
      crated: Date.now()
    }

    this.toasts.update(values => [...values, toast])
  }

  private runCheckToasts() {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        if (this.toasts().length) {
          this.filterToast()
        }
      }, 1000)
    })
  }

  filterToast() {
    this.toasts.set(this.toasts().filter(t => {
      const timeDifferenceByNowAndCreatedToast = Math.ceil((Date.now() - t.crated) / 1000);
      const timeLeft = this.inactivityTime - timeDifferenceByNowAndCreatedToast;
      return timeLeft > 0;
    }))
  }

  clearToast(toast: Toast) {
    this.toasts.set(this.toasts().filter(t => t !== toast))
  }
}
