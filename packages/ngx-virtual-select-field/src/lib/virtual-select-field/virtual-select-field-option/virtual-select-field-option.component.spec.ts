import { render } from '@testing-library/angular';

import { NgxVirtualSelectFieldOptionComponent } from './virtual-select-field-option.component';
import { NGX_VIRTUAL_SELECT_FIELD_OPTION_PARENT } from './virtual-select-field-option.models';

describe('NgxVirtualSelectFieldOptionComponent', () => {
  it('should initialize', async () => {
    const result = await render(NgxVirtualSelectFieldOptionComponent, {
      providers: [
        {
          provide: NGX_VIRTUAL_SELECT_FIELD_OPTION_PARENT,
          useValue: {
            multiple: false,
          },
        },
      ],
    });

    expect(result).toBeTruthy();
  });
});
