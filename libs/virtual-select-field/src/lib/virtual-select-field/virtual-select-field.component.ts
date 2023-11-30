import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
  MAT_FORM_FIELD,
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import {
  CdkOverlayOrigin,
  OverlayModule,
  ViewportRuler,
} from '@angular/cdk/overlay';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Observable, Subject, Subscription, tap } from 'rxjs';

import { VirtualSelectFieldOptionForDirective } from './virtual-select-field-option-for';

import {
  PANEL_WIDTH_AUTO,
  POSITIONS,
  VIRTUAL_SELECT_CONFIG,
} from './virtual-select-field.constants';
import { VirtualSelectConfig } from './virtual-select-field.models';
import {
  VIRTUAL_SELECT_FIELD_TRIGGER,
  VirtualSelectFieldTriggerDirective,
} from './virtual-select-field-trigger';

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

  @Input() panelWidth: string | number | null =
    this._defaultOptions?.panelWidth ?? PANEL_WIDTH_AUTO;

  @Output()
  valueChange: EventEmitter<TValue[]> = new EventEmitter<TValue[]>();

  @ContentChild(VirtualSelectFieldOptionForDirective)
  optionFor!: VirtualSelectFieldOptionForDirective<TValue>;

  @ContentChild(VIRTUAL_SELECT_FIELD_TRIGGER)
  customTrigger: VirtualSelectFieldTriggerDirective | null = null;

  readonly id = `lib-virtual-select-field-${VirtualSelectFieldComponent.nextId++}`;
  readonly controlType = 'lib-virtual-select-field';
  readonly POSITIONS = POSITIONS;
  readonly OVERLAY_PANEL_CLASS: string | string[] =
    this._defaultOptions?.overlayPanelClass || '';

  focused = false;
  autofilled = false;
  panelOpen = signal(false);

  overlayWidth: Signal<string | number>;

  ngControl: NgControl | null = inject(NgControl, { optional: true });

  protected readonly _destroy = new Subject<void>();
  protected preferredOverlayOrigin: CdkOverlayOrigin | ElementRef | undefined;

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
  private _viewPortRulerChange: Signal<void>;

  constructor(
    protected _viewportRuler: ViewportRuler,
    protected _changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(MAT_FORM_FIELD)
    protected _parentFormField: MatFormField,
    readonly _elementRef: ElementRef,
    @Optional()
    @Inject(VIRTUAL_SELECT_CONFIG)
    protected _defaultOptions?: VirtualSelectConfig
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this._fmMonitorSubscription = this._fm
      .monitor(this._elRef, true)
      .subscribe((origin) => {
        this.focused = !!origin;
        this._stateChanges.next();
      });

    // NOTE: View port ruler change stream runs outside the zone.
    //       Need to run change detection manually to trigger computed signal below.
    this._viewPortRulerChange = toSignal(
      this._viewportRuler
        .change()
        .pipe(tap(() => this._changeDetectorRef.detectChanges()))
    );

    this.overlayWidth = computed(() => {
      this._viewPortRulerChange();

      if (!this.panelOpen()) {
        return 0;
      }

      return this.resolveOverlayWidth(this.preferredOverlayOrigin);
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

  // NOTE: material components use class mat-form-field-hide-placeholder
  @HostBinding('class.lib-virtual-select-hide-placeholder')
  get hidePlaceholder() {
    return !this.focused || !this.empty;
  }

  get triggerValue(): string {
    if (this.empty) {
      return '';
    }

    //TODO: resolve trigger text bu selected values

    return 'mock build in trigger';
  }

  ngOnInit() {
    // TODO: mb move to constructor
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

  onContainerClick(): void {
    this.open();
  }

  @HostListener('focusin')
  protected onFocusIn() {
    if (!this.focused) {
      this.focused = true;
      this._stateChanges.next();
    }
  }

  @HostListener('focusout', ['$event'])
  protected onFocusOut(event: FocusEvent) {
    if (!this._elRef.nativeElement.contains(event.relatedTarget as Element)) {
      this._touched = true;
      this.focused = false;
      this._onTouched();
      this._stateChanges.next();
    }
  }

  protected emitValue(): void {
    this._onChange?.(this.value);
    this.valueChange.emit(this.value);
  }

  protected toggle(): void {
    if (this.panelOpen()) {
      this.close();
    } else {
      this.open;
    }
  }

  protected open() {
    if (this._parentFormField) {
      this.preferredOverlayOrigin =
        this._parentFormField.getConnectedOverlayOrigin();
    }

    this.panelOpen.set(true);
  }

  protected close() {
    this.panelOpen.set(false);
  }

  private resolveOverlayWidth(
    preferredOrigin: ElementRef<ElementRef> | CdkOverlayOrigin | undefined
  ): string | number {
    if (this.panelWidth === PANEL_WIDTH_AUTO) {
      const refToMeasure =
        preferredOrigin instanceof CdkOverlayOrigin
          ? preferredOrigin.elementRef
          : preferredOrigin || this._elementRef;
      return refToMeasure.nativeElement.getBoundingClientRect().width;
    }

    return this.panelWidth === null ? '' : this.panelWidth;
  }

  static ngAcceptInputType_required: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;

  static nextId = 0;
}
