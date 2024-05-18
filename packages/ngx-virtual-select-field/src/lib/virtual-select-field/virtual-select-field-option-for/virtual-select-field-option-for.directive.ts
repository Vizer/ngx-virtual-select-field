import { Directive, Input, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  NgxVirtualSelectFieldOptionModel,
  NgxVirtualSelectFieldOptionTemplateContextModel,
} from './virtual-select-field-option-for.models';

@Directive({
  selector: '[ngxVirtualSelectFieldOptionFor]',
  standalone: true,
})
export class NgxVirtualSelectFieldOptionForDirective<TValue> {
  /**
   * The options collection to render.
   * @required
   */
  @Input({ required: true, alias: 'ngxVirtualSelectFieldOptionForOf' })
  set options(options: NgxVirtualSelectFieldOptionModel<TValue>[]) {
    this.options$.next(options);
  }

  options$ = new BehaviorSubject<NgxVirtualSelectFieldOptionModel<TValue>[]>(
    []
  );

  constructor(
    public template: TemplateRef<
      NgxVirtualSelectFieldOptionTemplateContextModel<TValue>
    >
  ) {}

  static ngTemplateContextGuard<TValue>(
    _dir: NgxVirtualSelectFieldOptionForDirective<TValue>,
    ctx: unknown
  ): ctx is NgxVirtualSelectFieldOptionTemplateContextModel<TValue> {
    return true;
  }
}
