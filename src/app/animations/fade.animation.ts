import {trigger, state, style, transition, animate} from '@angular/animations';

export const fadeAnimation =
  trigger('fade', [
    state('void', style({ opacity: 0 })),
    state('*', style({ opacity: 1 })),
    transition(':enter', animate('500ms ease-out')),
    transition(':leave', animate('500ms ease-in')),
  ])
