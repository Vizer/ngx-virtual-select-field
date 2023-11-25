import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[libVirtualSelectFieldOptionFor]',
  standalone: true,
})
export class VirtualSelectFieldOptionForDirective<TValue> {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('libVirtualSelectFieldOptionForOf')
  options: { label: string; value: TValue }[] = [];

  @Input('libVirtualSelectFieldOptionForTemplate')
  template!: TemplateRef<unknown>;
}
