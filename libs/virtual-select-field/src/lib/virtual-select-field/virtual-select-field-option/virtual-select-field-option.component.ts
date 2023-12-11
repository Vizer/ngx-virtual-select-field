import {
  Component,
  Input,
  Inject,
  HostListener,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  signal,
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

  @Output()
  selectedChange = new EventEmitter<
    VirtualSelectFieldOptionSelectionChangeEvent<TValue>
  >();

  protected multiple = this._optionParent?.multiple ?? false;

  protected selected = signal(false);

  constructor(
    @Inject(VIRTUAL_SELECT_FIELD_OPTION_PARENT)
    private _optionParent: VirtualSelectFieldOptionParent
  ) {}

  deselect() {
    this.selected.set(false);
  }

  select() {
    this.selected.set(true);
  }

  @HostListener('click')
  protected onClick() {
    this.selected.set(this.multiple ? !this.selected() : true);

    this.selectedChange.emit({
      source: this,
      value: this.value,
      selected: this.selected(),
    });
  }

  // TODO: implement disabled state
}

export interface VirtualSelectFieldOptionSelectionChangeEvent<TValue> {
  source: VirtualSelectFieldOptionComponent<TValue>;
  value: TValue;
  selected: boolean;
}
