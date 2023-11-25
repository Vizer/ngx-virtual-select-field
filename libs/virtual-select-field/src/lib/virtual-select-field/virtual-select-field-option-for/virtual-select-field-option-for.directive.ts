import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[libVirtualSelectFieldOptionFor]',
  standalone: true,
})
export class VirtualSelectFieldOptionForDirective<TValue> {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('libVirtualSelectFieldOptionForOf')
  options: { label: string; value: TValue }[] = [];

  // @Input('libVirtualSelectFieldOptionForTemplate')
  // template!: TemplateRef<unknown>;

  constructor(
    public template: TemplateRef<{ $implicit: { label: string; value: TValue } }>
  ) {}

  static ngTemplateContextGuard<TValue>(
    _dir: VirtualSelectFieldOptionForDirective<TValue>,
    ctx: unknown
  ): ctx is { $implicit: { label: string; value: TValue }  } {
    return true;
  }
}
