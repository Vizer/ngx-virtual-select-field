import { InjectionToken } from '@angular/core';

export interface NgxVirtualSelectFieldOptionParent {
  multiple?: boolean;
}

export const NGX_VIRTUAL_SELECT_FIELD_OPTION_PARENT =
  new InjectionToken<NgxVirtualSelectFieldOptionParent>(
    'NGX_VIRTUAL_SELECT_FIELD_OPTION_PARENT'
  );
