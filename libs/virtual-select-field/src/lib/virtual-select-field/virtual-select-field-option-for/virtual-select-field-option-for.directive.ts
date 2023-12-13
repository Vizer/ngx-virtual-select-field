import { Directive, Input, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VirtualSelectFieldOptionModel } from './virtual-select-field-option-for.models';

@Directive({
  selector: '[libVirtualSelectFieldOptionFor]',
  standalone: true,
})
export class VirtualSelectFieldOptionForDirective<TValue> {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('libVirtualSelectFieldOptionForOf')
  set options(options: VirtualSelectFieldOptionModel<TValue>[]) {
    this.options$.next(options);
  }

  options$ = new BehaviorSubject<VirtualSelectFieldOptionModel<TValue>[]>([]);

  constructor(
    public template: TemplateRef<{
      $implicit: { label: string; value: TValue };
    }>
  ) {}

  static ngTemplateContextGuard<TValue>(
    _dir: VirtualSelectFieldOptionForDirective<TValue>,
    ctx: unknown
  ): ctx is {
    $implicit: VirtualSelectFieldOptionModel<TValue>;
  } {
    return true;
  }
}
