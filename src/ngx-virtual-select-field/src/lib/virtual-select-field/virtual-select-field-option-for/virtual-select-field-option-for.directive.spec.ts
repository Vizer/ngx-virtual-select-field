import { TemplateRef } from '@angular/core';
import { VirtualSelectFieldOptionForDirective } from './virtual-select-field-option-for.directive';

describe('VirtualSelectFieldOptionForDirective', () => {
  it('should create an instance', () => {
    const temaplte = {} as TemplateRef<{ $implicit: { label: string; value: number } }>;

    const directive = new VirtualSelectFieldOptionForDirective<number>(temaplte);

    expect(directive).toBeTruthy();
  });
});
