import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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

@Component({
  standalone: true,
  imports: [
    RouterModule,
    NgxVirtualSelectFieldBundle,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    JsonPipe,
    MatSelectModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-material-virtual-select';

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
