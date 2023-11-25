import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';

import { VirtualSelectFieldComponent } from '@angular-material-virtual-select/virtual-select-field';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, VirtualSelectFieldComponent],
  selector: 'angular-material-virtual-select-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-material-virtual-select';
}
