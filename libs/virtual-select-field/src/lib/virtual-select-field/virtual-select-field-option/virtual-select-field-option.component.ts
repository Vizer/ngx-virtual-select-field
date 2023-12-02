import {
  Component,
  Input,
  Inject,
  HostListener,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPseudoCheckboxModule } from '@angular/material/core';

import {
  VIRTUAL_SELECT_FIELD_OPTION_PARENT,
  VirtualSelectFieldOptionParent,
} from './virtual-select-field-option.models';
@Component({
  selector: 'lib-virtual-select-field-option',
  standalone: true,
  imports: [CommonModule, MatPseudoCheckboxModule],
  templateUrl: './virtual-select-field-option.component.html',
  styleUrl: './virtual-select-field-option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualSelectFieldOptionComponent<TValue> {
  @Input({ required: true })
  value!: TValue;

  multiple = this._optionParent?.multiple ?? false;

  selected: boolean = false;

  constructor(
    @Inject(VIRTUAL_SELECT_FIELD_OPTION_PARENT)
    private _optionParent: VirtualSelectFieldOptionParent
  ) {}

  @HostListener('click')
  onClick() {
    this.selected = this.multiple ? !this.selected : true;
  }

  // TODO: implement disabled state
}

export interface VirtualSelectFieldOptionSelectionChangeEvent<TValue> {
  source: VirtualSelectFieldOptionComponent<TValue>;
  value: TValue;
  selected: boolean;
}
