import {trigger, state, style, transition, animate} from '@angular/animations';

export const fadeAnimation =
  trigger('fade', [
    state(
      'default',
      style({
        opacity: 1,
      })
    ),
    state(
      'disabled',
      style({
        opacity: 0,
      })
    ),
    transition('* => *', animate('100ms linear')),
  ])
