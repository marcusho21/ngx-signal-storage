import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';

export const STORAGE = new InjectionToken('LocalStorage', {
  providedIn: 'root',
  factory: () => {
    const { defaultView } = inject(DOCUMENT);
    if (!defaultView?.localStorage)
      throw new Error('LocalStorage is not supported');

    return defaultView.localStorage;
  },
});

export const PREFIX = new InjectionToken('Storage prefix');
