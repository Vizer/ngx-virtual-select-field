import { RenderResult, render } from '@testing-library/angular';
import { By } from '@angular/platform-browser';
import { Type } from '@angular/core';

import {
  NGX_VIRTUAL_SELECT_FIELD_TRIGGER,
  NgxVirtualSelectFieldTriggerDirective,
} from './virtual-select-field-trigger.directive';

describe('NgxVirtualSelectFieldTriggerDirective', () => {
  it('should create an instance', async () => {
    const renderResult = await setup('');
    const directive = retrieveDirective(
      renderResult,
      NgxVirtualSelectFieldTriggerDirective
    );

    expect(renderResult).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  it('should provide itself as NGX_VIRTUAL_SELECT_FIELD_TRIGGER', async () => {
    const renderResult = await setup('');

    const debugElement = renderResult.fixture.debugElement.query(
      By.directive(NgxVirtualSelectFieldTriggerDirective)
    );
    const directiveInstance = debugElement.injector.get(
      NGX_VIRTUAL_SELECT_FIELD_TRIGGER
    );

    expect(directiveInstance).toBeTruthy();
  });
});

async function setup(triggerText: string) {
  return await render(
    `<div>
      <ngx-virtual-select-field-trigger>
        {{ triggerText }}
      </ngx-virtual-select-field-trigger>
    </div>`,
    {
      componentProperties: {
        triggerText,
      },
      imports: [NgxVirtualSelectFieldTriggerDirective],
    }
  );
}

function retrieveDirective<T>(
  renderResult: RenderResult<unknown, unknown>,
  directiveType: Type<T>
): T {
  return renderResult.fixture.debugElement
    .query(By.directive(directiveType))
    .injector.get(directiveType);
}
