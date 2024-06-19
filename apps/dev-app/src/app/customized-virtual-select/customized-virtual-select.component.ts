import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  NgxVirtualSelectFieldBundle,
  NgxVirtualSelectFieldOptionModel,
  NGX_VIRTUAL_SELECT_FIELD_CONFIG,
} from 'ngx-virtual-select-field';

@Component({
  selector: 'app-customized-virtual-select',
  standalone: true,
  imports: [CommonModule, NgxVirtualSelectFieldBundle, MatFormFieldModule],
  providers: [
    {
      provide: NGX_VIRTUAL_SELECT_FIELD_CONFIG,
      useValue: {
        panelWidth: 450,
        optionHeight: 36,
        panelViewportPageSize: 6,
      },
    },
  ],
  templateUrl: './customized-virtual-select.component.html',
  styleUrl: './customized-virtual-select.component.scss',
})
export class CustomizedVirtualSelectComponent {
  singleValue: number | null = null;

  options: NgxVirtualSelectFieldOptionModel<number>[] = new Array(100000)
    .fill(null)
    .map((_, index) => ({
      value: index,
      label: `${index} Option ${index}`,
      disabled: index % 5 === 0,
    }));
}
