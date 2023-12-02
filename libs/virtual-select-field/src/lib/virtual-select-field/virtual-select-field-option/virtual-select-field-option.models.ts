import { InjectionToken } from '@angular/core';

export interface VirtualSelectFieldOptionParent {
  multiple?: boolean;
}

export const VIRTUAL_SELECT_FIELD_OPTION_PARENT =
  new InjectionToken<VirtualSelectFieldOptionParent>(
    'VIRTUAL_SELECT_FIELD_OPTION_PARENT'
  );


