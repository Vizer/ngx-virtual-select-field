import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NxWelcomeComponent } from './nx-welcome.component';

import { VIRTUAL_SELECT } from '@angular-material-virtual-select/virtual-select-field';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    VIRTUAL_SELECT,
    MatFormFieldModule,
    MatInputModule,
  ],
  selector: 'angular-material-virtual-select-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-material-virtual-select';
  options = new Array(100000).fill(null).map((_, index) => ({
    value: index,
    label: `${index} Option ${index}`,
    disabled: index % 5 === 0,
  }));
}
