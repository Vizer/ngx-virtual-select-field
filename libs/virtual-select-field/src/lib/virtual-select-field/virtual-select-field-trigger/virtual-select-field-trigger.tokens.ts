import { InjectionToken } from '@angular/core';
import { VirtualSelectFieldTriggerDirective } from './virtual-select-field-trigger.directive';

export const VIRTUAL_SELECT_FIELD_TRIGGER =
  new InjectionToken<VirtualSelectFieldTriggerDirective>(
    'VIRTUAL_SELECT_FIELD_TRIGGER'
  );
