import { TemplateRef } from '@angular/core';
import { NgxVirtualSelectFieldOptionForDirective } from './virtual-select-field-option-for.directive';

describe('NgxVirtualSelectFieldOptionForDirective', () => {
  it('should create an instance', () => {
    const temaplte = {} as TemplateRef<{ $implicit: { label: string; value: number } }>;

    const directive = new NgxVirtualSelectFieldOptionForDirective<number>(temaplte);

    expect(directive).toBeTruthy();
  });
});
