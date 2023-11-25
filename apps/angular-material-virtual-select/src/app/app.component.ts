import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NxWelcomeComponent } from './nx-welcome.component';

import { VirtualSelectFieldComponent } from '@angular-material-virtual-select/virtual-select-field';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    VirtualSelectFieldComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
  selector: 'angular-material-virtual-select-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-material-virtual-select';
  options = [
    {
      value: 1,
      label: 'Option 1',
    },
    {
      value: 2,
      label: 'Option 2',
    },
    {
      value: 3,
      label: 'Option 3',
    },
  ];
}
