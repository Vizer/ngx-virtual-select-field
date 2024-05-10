import { Directive, Input, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgxVirtualSelectFieldOptionModel } from './virtual-select-field-option-for.models';

@Directive({
  selector: '[ngxVirtualSelectFieldOptionFor]',
  standalone: true,
})
export class NgxVirtualSelectFieldOptionForDirective<TValue> {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ngxVirtualSelectFieldOptionForOf')
  set options(options: NgxVirtualSelectFieldOptionModel<TValue>[]) {
    this.options$.next(options);
  }

  options$ = new BehaviorSubject<NgxVirtualSelectFieldOptionModel<TValue>[]>([]);

  constructor(
    public template: TemplateRef<{
      $implicit: { label: string; value: TValue };
    }>
  ) {}

  static ngTemplateContextGuard<TValue>(
    _dir: NgxVirtualSelectFieldOptionForDirective<TValue>,
    ctx: unknown
  ): ctx is {
    $implicit: NgxVirtualSelectFieldOptionModel<TValue>;
  } {
    return true;
  }
}
