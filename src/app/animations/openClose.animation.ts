import {animate, style, transition, trigger} from '@angular/animations';

export const openCloseAnimation =
  trigger('openClose', [
    transition(':enter', [
      style({
        opacity: 0.5,
        transform: 'scale(0.85)'
      }),
      animate('0.15s', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
    ]),
    transition(':leave', [
      style({
        opacity: 1,
        transform: 'scale(1)'
      }),
      animate('0.15s', style({
        opacity: 0.5,
        transform: 'scale(0.85)'
      })),
    ]),
  ])
