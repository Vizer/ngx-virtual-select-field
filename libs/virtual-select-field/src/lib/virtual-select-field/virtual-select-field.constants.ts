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
    // panelClass: 'mat-mdc-select-panel-above',
  },
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    // panelClass: 'mat-mdc-select-panel-above',
  },
];

export const VIRTUAL_SELECT_CONFIG = new InjectionToken<VirtualSelectConfig>(
  'VIRTUAL_SELECT_CONFIG'
);

export const PANEL_WIDTH_AUTO = 'auto';
