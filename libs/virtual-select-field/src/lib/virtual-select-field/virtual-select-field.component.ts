import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatFormFieldControl } from '@angular/material/form-field';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { VirtualSelectFieldOptionForDirective } from './virtual-select-field-option-for';

@Component({
  selector: 'lib-virtual-select-field',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  templateUrl: './virtual-select-field.component.html',
  styleUrl: './virtual-select-field.component.scss',
  providers: [
    { provide: MatFormFieldControl, useExisting: VirtualSelectFieldComponent },
  ],
})
// TODO: implement single value typings
export class VirtualSelectFieldComponent<TValue>
  implements
    OnInit,
    OnDestroy,
    MatFormFieldControl<TValue[]>,
    ControlValueAccessor
{
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby')
  userAriaDescribedBy = '';

  @Output()
  valueChange: EventEmitter<TValue[]> = new EventEmitter<TValue[]>();

  @ContentChild(VirtualSelectFieldOptionForDirective)
  optionFor!: VirtualSelectFieldOptionForDirective<TValue>;

  focused = false;
  autofilled = false;
  panelOpen = false;

  readonly id = `lib-virtual-select-field-${VirtualSelectFieldComponent.nextId++}`;
  readonly controlType = 'lib-virtual-select-field';

  public ngControl: NgControl | null = inject(NgControl, { optional: true });

  private _fm: FocusMonitor = inject(FocusMonitor);
  private _elRef: ElementRef<HTMLElement> = inject(ElementRef);
  private _stateChanges = new Subject<void>();

  private _onChange: (value: TValue[]) => void = () => void 0;
  private _onTouched: () => void = () => void 0;

  private _value: TValue[] = [];
  private _required = false;
  private _disabled = false;
  private _touched = false;
  private _placeholder = '';
  private _fmMonitorSubscription: Subscription;

  constructor() {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this._fmMonitorSubscription = this._fm
      .monitor(this._elRef, true)
      .subscribe((origin) => {
        this.focused = !!origin;
        this._stateChanges.next();
      });
  }

  @Input()
  set value(value: TValue[]) {
    if (this.value === value) {
      return;
    }

    this._value = value ? value : [];

    this._stateChanges.next();
  }

  get value() {
    return this._value;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(placeholder: string) {
    this._placeholder = placeholder;
    this._stateChanges.next();
  }

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(req: boolean) {
    this._required = coerceBooleanProperty(req);
    this._stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this._stateChanges.next();
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  get empty() {
    return this._value?.length === 0;
  }

  get stateChanges(): Observable<void> {
    return this._stateChanges.asObservable();
  }

  get errorState(): boolean {
    return !!this.ngControl?.invalid && this._touched;
  }

  @HostListener('focusin')
  onFocusIn() {
    if (!this.focused) {
      this.focused = true;
      this._stateChanges.next();
    }
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: FocusEvent) {
    if (!this._elRef.nativeElement.contains(event.relatedTarget as Element)) {
      this._touched = true;
      this.focused = false;
      this._onTouched();
      this._stateChanges.next();
    }
  }

  ngOnInit() {
    this._disabled = this.ngControl?.disabled ?? false;
  }

  ngOnDestroy() {
    this._stateChanges.complete();
    this._fm.stopMonitoring(this._elRef);
    this._fmMonitorSubscription?.unsubscribe();
  }

  // #region ControlValueAccessor

  writeValue(value: TValue[]): void {
    this.value = value;
  }

  registerOnChange(fn: (value: TValue[]) => void) {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // #endregion ControlValueAccessor

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elRef.nativeElement;

    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  emitValue(): void {
    this._onChange?.(this.value);
    this.valueChange.emit(this.value);
  }

  onContainerClick(): void {
    this.open();
  }

  toggle(): void {
    if (this.panelOpen) {
      this.close();
    } else {
      this.open;
    }
  }

  protected open() {
    this.panelOpen = true;
  }

  protected close() {
    this.panelOpen = false;
  }

  static ngAcceptInputType_required: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;

  static nextId = 0;
}
