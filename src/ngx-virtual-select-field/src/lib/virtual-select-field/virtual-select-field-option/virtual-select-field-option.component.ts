import {
  Component,
  Input,
  Inject,
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
import {
  MatPseudoCheckboxModule,
  MatRippleModule,
} from '@angular/material/core';

import {
  NGX_VIRTUAL_SELECT_FIELD_OPTION_PARENT,
  NgxVirtualSelectFieldOptionParent,
} from './virtual-select-field-option.models';
import { Highlightable, ListKeyManagerOption } from '@angular/cdk/a11y';

@Component({
  selector: 'ngx-virtual-select-field-option',
  standalone: true,
  imports: [CommonModule, MatPseudoCheckboxModule, MatRippleModule],
  templateUrl: './virtual-select-field-option.component.html',
  styleUrl: './virtual-select-field-option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    '(click)': 'onClick()',
    '[class.ngx-virtual-select-field-option--active]': 'active',
    '[class.ngx-virtual-select-field-option--selected]': 'selected()',
    '[class.ngx-virtual-select-field-option--multiple]': 'multiple',
    '[class.ngx-virtual-select-field-option--disabled]': 'disabled',
    class: 'ngx-virtual-select-field-option',
  },
})
export class NgxVirtualSelectFieldOptionComponent<TValue>
  implements Highlightable, ListKeyManagerOption
{
  @Input({ required: true })
  value!: TValue;

  @Input({ transform: booleanAttribute })
  disabled: boolean = false;

  @Output()
  selectedChange = new EventEmitter<
    NgxVirtualSelectFieldOptionSelectionChangeEvent<TValue>
  >();

  @ViewChild('textLabel', { static: true })
  protected readonly textLabel!: ElementRef<HTMLElement>;

  protected active = false;

  protected readonly multiple = this._optionParent?.multiple ?? false;

  protected readonly selected = signal(false);

  protected readonly hostNativeElement: HTMLElement;

  constructor(
    @Inject(NGX_VIRTUAL_SELECT_FIELD_OPTION_PARENT)
    private _optionParent: NgxVirtualSelectFieldOptionParent,
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>
  ) {
    this.hostNativeElement = this._elementRef.nativeElement;
  }

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
}

export interface NgxVirtualSelectFieldOptionSelectionChangeEvent<TValue> {
  source: NgxVirtualSelectFieldOptionComponent<TValue>;
  value: TValue;
  selected: boolean;
}
