import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPseudoCheckboxModule } from '@angular/material/core';

@Component({
  selector: 'lib-virtual-select-field-option',
  standalone: true,
  imports: [CommonModule, MatPseudoCheckboxModule],
  templateUrl: './virtual-select-field-option.component.html',
  styleUrl: './virtual-select-field-option.component.scss',
})
export class VirtualSelectFieldOptionComponent<TValue> {
  @Input({ required: true }) value!: TValue;

  multiple = false;

  selected: boolean = false;

  // TODO: implement disabled state
}
