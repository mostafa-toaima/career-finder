import {
  trigger,
  transition,
  style,
  animate,
  keyframes,
  query,
  stagger
} from '@angular/animations';

// Fade in animation
export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-out', style({ opacity: 1 }))
  ])
]);

// Slide in from top animation
export const slideInDown = trigger('slideInDown', [
  transition(':enter', [
    style({ transform: 'translateY(-20px)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ])
]);

// Slide in from bottom animation
export const slideInUp = trigger('slideInUp', [
  transition(':enter', [
    style({ transform: 'translateY(20px)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ])
]);

// Fade in from bottom animation
export const fadeInUp = trigger('fadeInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

// Scale in animation
export const scaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ transform: 'scale(0.8)', opacity: 0 }),
    animate('300ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({ transform: 'scale(1)', opacity: 1 }))
  ])
]);

// Pulse animation
export const pulse = trigger('pulse', [
  transition(':enter', [
    animate('1s ease-in-out', keyframes([
      style({ transform: 'scale(1)', offset: 0 }),
      style({ transform: 'scale(1.05)', offset: 0.5 }),
      style({ transform: 'scale(1)', offset: 1 })
    ]))
  ])
]);

// Bounce in animation (already defined in your code)
export const bounceIn = trigger('bounceIn', [
  transition(':enter', [
    animate('0.5s', keyframes([
      style({ opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)', offset: 0 }),
      style({ transform: 'scale3d(1.1, 1.1, 1.1)', offset: 0.2 }),
      style({ transform: 'scale3d(0.9, 0.9, 0.9)', offset: 0.4 }),
      style({ opacity: 1, transform: 'scale3d(1.03, 1.03, 1.03)', offset: 0.6 }),
      style({ transform: 'scale3d(0.97, 0.97, 0.97)', offset: 0.8 }),
      style({ opacity: 1, transform: 'scale3d(1, 1, 1)', offset: 1 })
    ]))
  ])
]);

// Fade in right animation (already defined in your code)
export const fadeInRight = trigger('fadeInRight', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(20px)' }),
    animate('300ms ease-out',
      style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);
