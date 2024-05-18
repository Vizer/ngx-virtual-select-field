import { ConnectedPosition } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';

import { NgxVirtualSelectFieldConfig } from './virtual-select-field.models';

export const POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    panelClass: 'ngx-virtual-select-field-overlay--above',
  },
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    panelClass: 'ngx-virtual-select-field-overlay--above',
  },
];

export const NGX_VIRTUAL_SELECT_FIELD_CONFIG = new InjectionToken<NgxVirtualSelectFieldConfig>(
  'NGX_VIRTUAL_SELECT_FIELD_CONFIG'
);

export const PANEL_WIDTH_AUTO = 'auto';

export const PANEL_VIEWPORT_PAGE_SIZE = 8;

export const OPTION_HEIGHT = 48;
