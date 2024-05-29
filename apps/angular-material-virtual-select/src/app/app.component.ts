import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { JsonPipe } from '@angular/common';
import {
  NgxVirtualSelectFieldBundle,
  NgxVirtualSelectFieldOptionModel,
} from 'ngx-virtual-select-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CustomizedVirtualSelectComponent } from './customized-virtual-select';

@Component({
  standalone: true,
  imports: [
    NgxVirtualSelectFieldBundle,
    MatFormFieldModule,
    ReactiveFormsModule,
    JsonPipe,
    MatSelectModule,
    CustomizedVirtualSelectComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  singleValue: number | null = null;

  multiselectValue: number[] | null = null;

  singleValueWithSelected: number = 16;

  multiselectValueWithDefault: number[] = [1, 9, 76];

  materialSingleSelect: number | null = null;
  materialMultiSingleSelect: number[] | null = null;

  options: NgxVirtualSelectFieldOptionModel<number>[] = new Array(100000)
    .fill(null)
    .map((_, index) => ({
      value: index,
      label: `${index} Option ${index}`,
      disabled: index % 5 === 0,
    }));

  form: FormGroup;
  matForm: FormGroup;
  optionsWithNull: (
    | NgxVirtualSelectFieldOptionModel<null>
    | NgxVirtualSelectFieldOptionModel<number>
  )[] = [
    {
      value: null,
      label: 'Null',
    },
    ...this.options,
  ];

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      multiselect: [[2, 3, 4], Validators.required],
      singleselect: [2, Validators.required],
    });

    this.matForm = formBuilder.group({
      multiselect: [[2, 3, 4], Validators.required],
      singleselect: [2, Validators.required],
    });
  }
}
