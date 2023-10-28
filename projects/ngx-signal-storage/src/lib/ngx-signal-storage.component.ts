import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-ngx-signal-storage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      ngx-signal-storage works!
    </p>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxSignalStorageComponent {

}
