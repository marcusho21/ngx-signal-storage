import { ApplicationConfig } from '@angular/core';
import { provideNgxSignalStorage } from 'ngx-signal-storage';

export const appConfig: ApplicationConfig = {
  providers: [provideNgxSignalStorage('sandbox_')],
};
