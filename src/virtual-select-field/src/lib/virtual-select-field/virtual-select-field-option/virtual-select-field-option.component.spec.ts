import { render } from '@testing-library/angular';

import { VirtualSelectFieldOptionComponent } from './virtual-select-field-option.component';
import { VIRTUAL_SELECT_FIELD_OPTION_PARENT } from './virtual-select-field-option.models';

describe('VirtualSelectFieldOptionComponent', () => {
  it('should initialize', async () => {
    const result = await render(VirtualSelectFieldOptionComponent, {
      providers: [
        {
          provide: VIRTUAL_SELECT_FIELD_OPTION_PARENT,
          useValue: {
            multiple: false,
          },
        },
      ],
    });

    expect(result).toBeTruthy();
  });
});
