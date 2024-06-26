import { Directive, InjectionToken } from '@angular/core';

export const NGX_VIRTUAL_SELECT_FIELD_TRIGGER =
  new InjectionToken<NgxVirtualSelectFieldTriggerDirective>(
    'NGX_VIRTUAL_SELECT_FIELD_TRIGGER'
  );

@Directive({
  selector: 'ngx-virtual-select-field-trigger',
  providers: [
    {
      provide: NGX_VIRTUAL_SELECT_FIELD_TRIGGER,
      useExisting: NgxVirtualSelectFieldTriggerDirective,
    },
  ],
  standalone: true,
})
export class NgxVirtualSelectFieldTriggerDirective {}
