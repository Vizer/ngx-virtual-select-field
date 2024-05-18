import { RenderResult, render } from '@testing-library/angular';
import { Type } from '@angular/core';
import { By } from '@angular/platform-browser';

import { NgxVirtualSelectFieldOptionForDirective } from './virtual-select-field-option-for.directive';

describe('NgxVirtualSelectFieldOptionForDirective', () => {
  it('should create an instance', async () => {
    const result = await setup([]);

    expect(result).toBeTruthy();
  });

  it('should accepts options in #options input', async () => {
    const options = createMockOptions();

    const result = await setup(options);

    const directive = retrieveDirective(
      result,
      NgxVirtualSelectFieldOptionForDirective
    );

    expect(result).toBeTruthy();
    expect(directive.options$.value).toEqual(createMockOptions());
  });

  it('should send options to subject on #options input ', async () => {
    const options = createMockOptions();

    const result = await setup(options);

    const directive = retrieveDirective(
      result,
      NgxVirtualSelectFieldOptionForDirective<number>
    );

    let actualOptions = options;

    directive.options$.subscribe((opts) => (actualOptions = opts));

    expect(actualOptions).toEqual(options);

    directive.options = [];

    expect(actualOptions).toEqual([]);
  });

  describe('ngTemplateContextGuard', () => {
    it('should return true', async () => {
      const result = await setup([]);

      const directive = retrieveDirective(
        result,
        NgxVirtualSelectFieldOptionForDirective
      );

      expect(
        NgxVirtualSelectFieldOptionForDirective.ngTemplateContextGuard(
          directive,
          null
        )
      ).toBeTruthy();
    });
  });
});

async function setup(options: { label: string; value: number }[]) {
  return await render(
    `<div *ngxVirtualSelectFieldOptionFor="let option of options"></div>`,
    {
      componentProperties: {
        options,
      },
      imports: [NgxVirtualSelectFieldOptionForDirective],
    }
  );
}

function createMockOptions() {
  return [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
  ];
}

function retrieveDirective<T>(
  renderResult: RenderResult<unknown, unknown>,
  directiveType: Type<T>
): T {
  const node = renderResult.fixture.debugElement.queryAllNodes(
    By.directive(directiveType)
  )[0];

  return node.injector.get(directiveType);
}
