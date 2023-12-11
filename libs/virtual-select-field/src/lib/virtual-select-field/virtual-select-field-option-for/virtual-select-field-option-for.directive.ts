import { Directive, Input, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Directive({
  selector: '[libVirtualSelectFieldOptionFor]',
  standalone: true,
})
export class VirtualSelectFieldOptionForDirective<TValue> {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('libVirtualSelectFieldOptionForOf')
  set options(options: { label: string; value: TValue }[]) {
    this.options$.next(options);
  }

  options$ = new BehaviorSubject<{ label: string; value: TValue }[]>([]);

  constructor(
    public template: TemplateRef<{
      $implicit: { label: string; value: TValue };
    }>
  ) {}

  static ngTemplateContextGuard<TValue>(
    _dir: VirtualSelectFieldOptionForDirective<TValue>,
    ctx: unknown
  ): ctx is { $implicit: { label: string; value: TValue } } {
    return true;
  }
}
