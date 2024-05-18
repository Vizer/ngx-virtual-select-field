import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Signal,
  TrackByFunction,
  ViewChild,
  computed,
  inject,
  numberAttribute,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { ListKeyManager } from '@angular/cdk/a11y';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  OverlayModule,
  ViewportRuler,
} from '@angular/cdk/overlay';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import {
  MAT_FORM_FIELD,
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { hasModifierKey } from '@angular/cdk/keycodes';
import {
  Observable,
  Subject,
  debounceTime,
  defer,
  map,
  merge,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import {
  NgxVirtualSelectFieldOptionForDirective,
  NgxVirtualSelectFieldOptionModel,
} from './virtual-select-field-option-for';
import {
  NGX_VIRTUAL_SELECT_FIELD_TRIGGER,
  NgxVirtualSelectFieldTriggerDirective,
} from './virtual-select-field-trigger';
import {
  NGX_VIRTUAL_SELECT_FIELD_OPTION_PARENT,
  NgxVirtualSelectFieldOptionComponent,
  NgxVirtualSelectFieldOptionParent,
  NgxVirtualSelectFieldOptionSelectionChangeEvent,
} from './virtual-select-field-option';

import {
  OPTION_HEIGHT,
  PANEL_WIDTH_AUTO,
  POSITIONS,
  PANEL_VIEWPORT_PAGE_SIZE,
  NGX_VIRTUAL_SELECT_FIELD_CONFIG,
} from './virtual-select-field.constants';
import { NgxVirtualSelectFieldConfig } from './virtual-select-field.models';
import {
  ARROW_DOWN_KEY,
  ARROW_LEFT_KEY,
  ARROW_RIGHT_KEY,
  ARROW_UP_KEY,
  ENTER_CODE,
  KEY_A_CODE,
  SPACE_CODE,
} from './keycodes';

@Component({
  selector: 'ngx-virtual-select-field',
  exportAs: 'ngxVirtualSelectField',
  standalone: true,
  imports: [CommonModule, OverlayModule, ScrollingModule],
  templateUrl: './virtual-select-field.component.html',
  styleUrl: './virtual-select-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MatFormFieldControl, useExisting: NgxVirtualSelectFieldComponent },
    {
      provide: NGX_VIRTUAL_SELECT_FIELD_OPTION_PARENT,
      useExisting: NgxVirtualSelectFieldComponent,
    },
  ],
  host: {
    '[attr.tabindex]': 'tabIndex',
    '(focus)': 'onFocusIn()',
    '(blur)': 'onFocusOut()',
    '(keydown)': 'onKeyDown($event)',
    class: 'ngx-virtual-select-field',
    '[class.ngx-virtual-select-field-hide-placeholder]': 'hidePlaceholder',
    '[class.ngx-virtual-select-field-disabled]': 'disabled',
    '[class.ngx-virtual-select-field-invalid]': 'errorState',
  },
})
export class NgxVirtualSelectFieldComponent<TValue>
  implements
    OnInit,
    OnDestroy,
    AfterContentInit,
    MatFormFieldControl<TValue[] | TValue>,
    ControlValueAccessor,
    NgxVirtualSelectFieldOptionParent
{
  @Input('aria-describedby')
  userAriaDescribedBy = '';

  /**
   * Width for overlay panel
   * @default 'auto'
   */
  @Input()
  panelWidth: string | number | null =
    this._defaultOptions?.panelWidth ?? PANEL_WIDTH_AUTO;

  /**
   * Height for an option element
   * @default 48
   */
  @Input({
    transform: (value: unknown) =>
      value == null ? OPTION_HEIGHT : numberAttribute(value),
  })
  optionHeight: number = this._defaultOptions?.optionHeight ?? OPTION_HEIGHT;

  /**
   * Amount of visible items in list
   * @default 8
   */
  @Input({
    transform: (value: unknown) =>
      value == null ? PANEL_VIEWPORT_PAGE_SIZE : numberAttribute(value),
  })
  panelViewportPageSize: number =
    this._defaultOptions?.panelViewportPageSize ?? PANEL_VIEWPORT_PAGE_SIZE;

  /**
   * Enable multiple selection
   * @default false
   */
  @Input({ transform: coerceBooleanProperty })
  multiple: boolean = false;

  /**
   * Tab index for keyboard navigation
   * @default 0
   */
  @Input({
    transform: (value: unknown) => (value == null ? 0 : numberAttribute(value)),
  })
  tabIndex: number = 0;

  /**
   * Milliseconds to wait before navigating to active element after keyboard search
   * @default 100
   */
  @Input({ transform: numberAttribute })
  typeaheadDebounceInterval: number = 100;

  /**
   * CSS class to be added to the panel element
   * @default none
   */
  @Input()
  panelClass: string | string[] | null = null;

  /**
   * Value change event
   */
  @Output()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueChange = new EventEmitter<any>();

  @ViewChild(CdkVirtualScrollViewport, { static: false })
  cdkVirtualScrollViewport!: CdkVirtualScrollViewport;

  @ViewChild(CdkConnectedOverlay, { static: false })
  cdkConnectedOverlay!: CdkConnectedOverlay;

  @ContentChild(NgxVirtualSelectFieldOptionForDirective)
  optionFor!: NgxVirtualSelectFieldOptionForDirective<TValue>;

  @ContentChild(NGX_VIRTUAL_SELECT_FIELD_TRIGGER)
  customTrigger: NgxVirtualSelectFieldTriggerDirective | null = null;

  @ContentChildren(NgxVirtualSelectFieldOptionComponent)
  optionsQuery: QueryList<NgxVirtualSelectFieldOptionComponent<TValue>> | null =
    null;

  readonly id = `ngx-virtual-select-field-${NgxVirtualSelectFieldComponent.nextId++}`;
  readonly controlType = 'ngx-virtual-select-field';

  autofilled = false;
  panelOpen = signal(false);
  triggerValue$: Observable<string> | null = null;
  overlayWidth: Signal<string | number>;

  protected readonly POSITIONS = POSITIONS;
  protected readonly overlayPanelClass: string | string[] =
    this._defaultOptions?.overlayPanelClass || '';
  readonly ngControl: NgControl | null = inject(NgControl, { optional: true });
  protected readonly inheritedColorTheme: string;
  protected readonly _destroy = new Subject<void>();
  protected preferredOverlayOrigin: CdkOverlayOrigin | ElementRef | undefined;

  private _elRef: ElementRef<HTMLElement> = inject(ElementRef);
  private _stateChanges = new Subject<void>();

  private _onChange: (value: TValue[] | TValue) => void = () => void 0;
  private _onTouched: () => void = () => void 0;

  private _value: TValue[] = [];
  private _focused = false;
  private _required = false;
  private _disabled = false;
  private _touched = false;
  private _placeholder = '';
  private _selectionModel!: SelectionModel<
    NgxVirtualSelectFieldOptionModel<TValue>
  >;
  private _viewPortRulerChange: Signal<void>;
  private _scrolledIndexChange = new Subject<void>();
  private _keyManager: ListKeyManager<
    NgxVirtualSelectFieldOptionModel<TValue>
  > | null = null;

  // NOTE: recursive defer observable to await for options to be rendered
  private readonly _optionSelectionChanges: Observable<
    NgxVirtualSelectFieldOptionSelectionChangeEvent<TValue>
  > = defer(() => {
    const options = this.optionsQuery;

    if (options) {
      return options.changes.pipe(
        startWith(options),
        switchMap(() =>
          merge(...options.map((option) => option.selectedChange))
        )
      );
    }

    return this._ngZone.onStable.pipe(
      take(1),
      switchMap(() => this._optionSelectionChanges)
    );
  }) as Observable<NgxVirtualSelectFieldOptionSelectionChangeEvent<TValue>>;

  // NOTE: optionSelectionChanges in mat select with defer and onStable to await for options to be rendered
  constructor(
    protected _viewportRuler: ViewportRuler,
    protected _changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(MAT_FORM_FIELD)
    protected _parentFormField: MatFormField,
    readonly _elementRef: ElementRef,
    private _ngZone: NgZone,
    @Optional()
    @Inject(NGX_VIRTUAL_SELECT_FIELD_CONFIG)
    protected _defaultOptions?: NgxVirtualSelectFieldConfig
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
      this._disabled = this.ngControl.disabled ?? false;
    }

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

    this.inheritedColorTheme = this._parentFormField
      ? `mat-${this._parentFormField.color}`
      : '';
  }

  /**
   * Value of the select field
   * @default null
   */
  @Input()
  set value(value: TValue[] | TValue | null) {
    if (this.value === value) {
      return;
    }

    value = value ? value : [];

    if (!Array.isArray(value)) {
      value = [value];
    }

    this._value = value;

    this._selectionModel?.setSelection(
      ...this._value.map(
        (v) => this.optionFor.options$.value.find((o) => o.value === v)!
      )
    );

    this._stateChanges.next();
  }

  get value(): TValue[] | TValue {
    if (this.multiple) {
      return this._value;
    } else {
      return this._value[0];
    }
  }

  /**
   * Placeholder for the select field
   * @default none
   */
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(placeholder: string) {
    this._placeholder = placeholder;
    this._stateChanges.next();
  }

  /**
   * Define if fields is required
   * @default false
   */
  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(req: boolean) {
    this._required = coerceBooleanProperty(req);
    this._stateChanges.next();
  }

  /**
   * Define if field is disabled
   * @default false
   */
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
    return this._selectionModel.isEmpty();
  }

  get stateChanges(): Observable<void> {
    return this._stateChanges.asObservable();
  }

  get errorState(): boolean {
    return !!this.ngControl?.invalid && this._touched;
  }

  get hidePlaceholder() {
    return !this.focused || !this.empty;
  }

  get focused(): boolean {
    // NOTE: panel open is needed to keep form field in focused state during interaction with options
    return this._focused || this.panelOpen();
  }

  ngOnInit() {
    // TODO: consider using this._selectionModel.changed
    this._selectionModel = new SelectionModel<
      NgxVirtualSelectFieldOptionModel<TValue>
    >(this.multiple, [], true);

    // NOTE: mat select listens to stateChanges of options components.
    // here the source source of updates is optionFor directive
  }

  ngAfterContentInit() {
    if (!this.customTrigger) {
      this.triggerValue$ = this._selectionModel.changed.pipe(
        startWith(null),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        map((_selected) =>
          this._selectionModel.selected
            .map((option) => option?.label ?? '')
            .join(', ')
        )
      );
    }

    this.optionFor.options$
      .pipe(
        takeUntil(this._destroy),
        tap((options) =>
          this._selectionModel?.setSelection(
            ...this._value.map((v) => options.find((o) => o.value === v)!)
          )
        ),
        tap((options) => this.initListKeyManager(options)),
        switchMap((options) =>
          merge(
            this._optionSelectionChanges.pipe(
              tap(
                (
                  selectionEvent: NgxVirtualSelectFieldOptionSelectionChangeEvent<TValue>
                ) => this.updateOptionSelection(selectionEvent, options)
              )
            ),

            this._scrolledIndexChange.pipe(
              debounceTime(100),
              tap(() => this.updateRenderedOptionsState(options))
            )
          )
        )
      )
      .subscribe();
  }

  private updateOptionSelection(
    selectionEvent: NgxVirtualSelectFieldOptionSelectionChangeEvent<TValue>,
    options: NgxVirtualSelectFieldOptionModel<TValue>[]
  ) {
    const selectedIndex = options.findIndex(
      (option) => option.value === selectionEvent.value
    );
    const selectedOption = options[selectedIndex];

    if (this.multiple) {
      this._selectionModel.toggle(selectedOption);
    } else if (selectedOption.value === null) {
      this._selectionModel.clear();
      this.optionsQuery?.forEach((option) => option.deselect());
      this.close();
    } else {
      this._selectionModel.select(selectedOption);
      this.optionsQuery?.forEach((option) => {
        if (option.value !== selectionEvent.value) {
          option.deselect();
        }
      });

      this.close();
    }

    if (this._selectionModel.isSelected(selectedOption)) {
      this._keyManager?.setActiveItem(selectedIndex);
    }

    // NOTE: this need to keep form field in focus state
    this.focus();
    this.emitValue();
  }

  private updateRenderedOptionsState(
    options: NgxVirtualSelectFieldOptionModel<TValue>[]
  ) {
    this.optionsQuery!.forEach((optionComponent) => {
      const option = options.find((o) => o.value === optionComponent.value)!;

      // NOTE: deselect for all is needed because of virtual scroll and reusing options
      optionComponent.deselect();
      if (this._selectionModel.isSelected(option)) {
        optionComponent.select();
      }
    });
  }

  ngOnDestroy() {
    this._stateChanges.complete();
  }

  // #region ControlValueAccessor

  writeValue(value: TValue[]): void {
    this.value = value;
  }

  registerOnChange(fn: (value: TValue[] | TValue) => void) {
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
    this.focus();
    this.open();
  }

  onOverlayAttached() {
    this.cdkConnectedOverlay.positionChange
      .pipe(
        take(1),
        switchMap(() => this._scrolledIndexChange.pipe(take(1)))
      )
      .subscribe(() => {
        if (!this._selectionModel.isEmpty()) {
          let targetIndex = this.optionFor.options$.value.findIndex(
            (option) => option === this._selectionModel.selected[0]
          );

          targetIndex = targetIndex - this.panelViewportPageSize / 2;

          this.cdkVirtualScrollViewport.scrollToIndex(targetIndex);
        }
      });
  }

  protected onFocusIn() {
    if (!this.focused) {
      this._focused = true;
      this._stateChanges.next();
    }
  }

  protected onFocusOut() {
    this._focused = false;

    if (!this.panelOpen()) {
      this._touched = true;
      this._onTouched();
      this._stateChanges.next();
    }
  }

  protected onKeyDown(event: KeyboardEvent) {
    if (this.disabled) {
      return;
    }

    if (this.panelOpen()) {
      this.doPanelOpenedKeydown(event);
    } else {
      this.doPanelClosedKeydown(event);
    }
  }

  private doPanelOpenedKeydown(event: KeyboardEvent) {
    const keyManager = this._keyManager!;
    const activeItem = keyManager.activeItem;
    const isTyping = keyManager.isTyping();

    if (
      (event.key === ARROW_DOWN_KEY || event.key === ARROW_UP_KEY) &&
      event.altKey
    ) {
      event.preventDefault();
      this.close();
    } else if (
      !isTyping &&
      (event.code == ENTER_CODE || event.code === SPACE_CODE) &&
      activeItem &&
      !hasModifierKey(event)
    ) {
      event.preventDefault();

      const option = this.findOptionByValue(activeItem.value);

      this._selectionModel.toggle(option);

      this.updateRenderedOptionsState(this.optionFor.options$.value);

      this.emitValue();
    } else if (
      !isTyping &&
      this.multiple &&
      event.code === KEY_A_CODE &&
      event.ctrlKey
    ) {
      event.preventDefault();
      const enabledOptionValues = this.optionFor.options$.value.filter(
        (option) => !option.disabled
      );

      const hasDeselectedOptions =
        enabledOptionValues.length > this._selectionModel.selected.length;

      if (hasDeselectedOptions) {
        this._selectionModel.select(...enabledOptionValues);
        this.optionsQuery!.forEach((optionComponent) => {
          if (!optionComponent.disabled) {
            optionComponent.select();
          }
        });
      } else {
        this._selectionModel.clear();
        this.optionsQuery!.forEach((optionComponent) => {
          optionComponent.deselect();
        });
      }
    } else {
      const previouslyFocusedIndex = keyManager.activeItemIndex;

      keyManager.onKeydown(event);

      if (
        this.multiple &&
        (event.key === ARROW_DOWN_KEY || event.key === ARROW_UP_KEY) &&
        event.shiftKey &&
        keyManager.activeItem &&
        keyManager.activeItemIndex !== previouslyFocusedIndex
      ) {
        this.selectOptionByValue(keyManager.activeItem.value);
      }
    }
  }

  private doPanelClosedKeydown(event: KeyboardEvent): void {
    const keyManager = this._keyManager!;
    const isTyping = keyManager.isTyping();

    const isArrowKey =
      event.key === ARROW_DOWN_KEY ||
      event.key === ARROW_UP_KEY ||
      event.key === ARROW_RIGHT_KEY ||
      event.key === ARROW_LEFT_KEY;

    if (
      (!isTyping &&
        (event.code === SPACE_CODE || event.code === ENTER_CODE) &&
        !hasModifierKey(event)) ||
      ((this.multiple || event.altKey) && isArrowKey)
    ) {
      event.preventDefault(); // prevents the page from scrolling down when pressing space
      this.open();
    } else if (!this.multiple) {
      const previouslySelectedOptionIndex = keyManager.activeItemIndex;
      keyManager.onKeydown(event);
      const selectedOptionIndex = keyManager.activeItemIndex;

      if (
        selectedOptionIndex &&
        previouslySelectedOptionIndex !== selectedOptionIndex
      ) {
        this.selectOptionByValue(keyManager.activeItem!.value);

        // TODO: Add live announcer
        // We set a duration on the live announcement, because we want the live element to be
        // cleared after a while so that users can't navigate to it using the arrow keys.
        // this._liveAnnouncer.announce((selectedOption as MatOption).viewValue, 10000);
      }
    }
  }

  protected trackByOptions: TrackByFunction<{ label: string; value: TValue }> =
    (index: number, options: { label: string; value: TValue }) => {
      return options.value;
    };

  protected onScrolledIndexChange(): void {
    this._scrolledIndexChange.next();
  }

  protected emitValue(): void {
    this._value = this._selectionModel.selected.map((option) => option.value);

    this.valueChange.emit(this.value);
    this._onChange?.(this.value);
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
    this._touched = true;
    this._onTouched();
    this._stateChanges.next();
  }

  private focus() {
    this._elementRef.nativeElement.focus();
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

  private initListKeyManager(options: NgxVirtualSelectFieldOptionModel<TValue>[]) {
    // TODO [refactor]: mb move to separate method
    const normalizedOptions = options.map((option) => ({
      value: option.value,
      label: option.label,
      disabled: option.disabled ?? false,
      getLabel: () => option.getLabel?.() ?? option.label,
    }));

    this._keyManager?.destroy();

    this._keyManager = new ListKeyManager<
      NgxVirtualSelectFieldOptionModel<TValue>
    >(normalizedOptions)
      .withTypeAhead(this.typeaheadDebounceInterval)
      .withVerticalOrientation()
      .withHomeAndEnd()
      .withPageUpDown()
      .withAllowedModifierKeys(['shiftKey']);

    this._keyManager.tabOut.subscribe(() => {
      if (this.panelOpen()) {
        if (this._keyManager?.activeItem) {
          this.selectOptionByValue(this._keyManager!.activeItem!.value);
        }

        this.focus();
        this.close();
      }
    });

    this._keyManager.change.subscribe((index) => {
      this.optionsQuery?.forEach((option) => option.setInactiveStyles());
      const activeOption = options[index];

      const shouldScrollToActiveItem = this.shouldScrollToActiveItem(index);
      if (shouldScrollToActiveItem) {
        this.cdkVirtualScrollViewport.scrolledIndexChange
          .pipe(take(1))
          .subscribe(() => this.setActiveOptionByValues(activeOption.value));
        this.cdkVirtualScrollViewport.scrollToIndex(index);
      } else {
        this.setActiveOptionByValues(activeOption.value);
      }
    });
  }

  private shouldScrollToActiveItem(targetIndex: number): boolean {
    if (!this.panelOpen()) {
      return false;
    }

    const scrollTop =
      this.cdkVirtualScrollViewport.elementRef.nativeElement.scrollTop;

    // NOTE: -1 is needed to prevent scrolling to next item out of the viewport
    const bottomScroll =
      scrollTop + this.optionHeight * this.panelViewportPageSize - 1;
    const targetScroll = this.optionHeight * targetIndex;

    return scrollTop > targetScroll || bottomScroll < targetScroll;
  }

  private selectOptionByValue(value: TValue) {
    const option = this.findOptionByValue(value);

    this._selectionModel.select(option);

    this.updateRenderedOptionsState(this.optionFor.options$.value);

    this.emitValue();
  }

  private findOptionByValue(
    value: TValue
  ): NgxVirtualSelectFieldOptionModel<TValue> {
    const result = this.optionFor.options$.value.find(
      (option) => option.value === value
    );

    if (!result) {
      throw new Error(`Option with value ${value} not found`);
    }

    return result;
  }

  private setActiveOptionByValues(value: TValue) {
    const optionComponent = this.optionsQuery?.find(
      (option) => option.value === value
    );
    optionComponent?.setActiveStyles();
  }

  static ngAcceptInputType_required: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;

  static nextId = 0;
}