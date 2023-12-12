import {
  Component,
  Input,
  Inject,
  HostListener,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  signal,
  booleanAttribute,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPseudoCheckboxModule } from '@angular/material/core';

import {
  VIRTUAL_SELECT_FIELD_OPTION_PARENT,
  VirtualSelectFieldOptionParent,
} from './virtual-select-field-option.models';
import { Highlightable, ListKeyManagerOption } from '@angular/cdk/a11y';

@Component({
  selector: 'lib-virtual-select-field-option',
  standalone: true,
  imports: [CommonModule, MatPseudoCheckboxModule],
  templateUrl: './virtual-select-field-option.component.html',
  styleUrl: './virtual-select-field-option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    '[class.lib-virtual-select-field-option--active]': 'active',
    '[class.lib-virtual-select-field-option--selected]': 'selected()',
    '[class.lib-virtual-select-field-option--multiple]': 'multiple',
    '[class.lib-virtual-select-field-option--disabled]': 'disabled',
    class: 'lib-virtual-select-field-option',
  },
})
export class VirtualSelectFieldOptionComponent<TValue>
  implements Highlightable, ListKeyManagerOption
{
  @Input({ required: true })
  value!: TValue;

  @Input({ transform: booleanAttribute })
  disabled: boolean = false;

  @Output()
  selectedChange = new EventEmitter<
    VirtualSelectFieldOptionSelectionChangeEvent<TValue>
  >();

  @ViewChild('textLabel', { static: true })
  protected textLabel!: ElementRef<HTMLElement>;

  protected active = false;

  protected multiple = this._optionParent?.multiple ?? false;

  protected selected = signal(false);

  constructor(
    @Inject(VIRTUAL_SELECT_FIELD_OPTION_PARENT)
    private _optionParent: VirtualSelectFieldOptionParent,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  // #region Highlightable

  setActiveStyles(): void {
    if (!this.active) {
      this.active = true;
      this._changeDetectorRef.markForCheck();
    }
  }

  setInactiveStyles(): void {
    if (this.active) {
      this.active = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  // #endregion Highlightable

  // #region FocusableOption

  getLabel(): string {
    return this.textLabel.nativeElement.textContent?.trim() ?? '';
  }

  // #endregion FocusableOption

  deselect() {
    this.selected.set(false);
  }

  select() {
    this.selected.set(true);
  }

  @HostListener('click')
  protected onClick() {
    if (this.disabled) {
      return;
    }

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
