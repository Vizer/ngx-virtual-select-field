import { Directive, InjectionToken } from '@angular/core';

export const VIRTUAL_SELECT_FIELD_TRIGGER =
  new InjectionToken<VirtualSelectFieldTriggerDirective>(
    'VIRTUAL_SELECT_FIELD_TRIGGER'
  );

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'lib-virtual-select-field-trigger',
  providers: [
    {
      provide: VIRTUAL_SELECT_FIELD_TRIGGER,
      useExisting: VirtualSelectFieldTriggerDirective,
    },
  ],
  standalone: true,
})
export class VirtualSelectFieldTriggerDirective {}
