import {trigger, state, style, transition, animate} from '@angular/animations';

export const slideLeftMargin =
  trigger('slideLeft', [
    state(
      'open',
      style({
        marginLeft: '0',
      }),
    ),
    state(
      'closed',
      style({
        marginLeft: 'calc(-280px - 1rem)',
      }),
    ),
    transition('open <=> closed', [animate('.2s linear')]),
  ])
