import { ConnectedPosition } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';

import { VirtualSelectConfig } from './virtual-select-field.models';

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

export const VIRTUAL_SELECT_CONFIG = new InjectionToken<VirtualSelectConfig>(
  'VIRTUAL_SELECT_CONFIG'
);

export const PANEL_WIDTH_AUTO = 'auto';

// TODO: add itemSize input and config property
export const VIEWPORT_VISIBLE_ITEMS = 8;

export const OPTION_HEIGHT = 48;
