import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { JsonPipe } from '@angular/common';
import {
  VIRTUAL_SELECT,
  VirtualSelectFieldOptionModel,
} from '@angular-material-virtual-select/virtual-select-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    VIRTUAL_SELECT,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    JsonPipe,
  ],
  selector: 'angular-material-virtual-select-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-material-virtual-select';

  multiselectValue: number[] = [1, 9, 76];

  options: VirtualSelectFieldOptionModel<number>[] = new Array(100000)
    .fill(null)
    .map((_, index) => ({
      value: index,
      label: `${index} Option ${index}`,
      disabled: index % 5 === 0,
    }));

  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      multiselect: [[3,2], Validators.required],
      singleselect: [[2], Validators.required],
    });
  }
}
