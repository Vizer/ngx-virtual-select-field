import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RenderResult, render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import {
  NgxVirtualSelectFieldOptionForDirective,
  NgxVirtualSelectFieldOptionModel,
} from './virtual-select-field-option-for';
import { NgxVirtualSelectFieldOptionComponent } from './virtual-select-field-option';
import { NgxVirtualSelectFieldTriggerDirective } from './virtual-select-field-trigger';
import { NgxVirtualSelectFieldComponent } from './virtual-select-field.component';

describe('VirtualSelectFieldComponent', () => {
  beforeAll(() => {
    Element.prototype.scrollTo = () => {};
  });

  describe('as a single select control', () => {
    test('should render empty field wth placeholder', async () => {
      const expectedPlaceholder = 'test placeholder';

      const result = await Arrange.setupSingleSelectAsMaterialFormField({
        placeholder: expectedPlaceholder,
        options: Arrange.createOptions(),
        value: null,
      });

      expect(result.getByText(expectedPlaceholder)).toBeTruthy();
    });

    test('should render field with selected value', async () => {
      const options = Arrange.createOptions();
      const expectedPlaceholder = 'test placeholder';
      const expectedValue = options[2].value;
      const expectedValueLabel = options[2].label;

      const result = await Arrange.setupSingleSelectAsMaterialFormField({
        placeholder: expectedPlaceholder,
        options,
        value: expectedValue,
      });

      expect(result.queryByText(expectedPlaceholder)).toBeFalsy();
      expect(result.getByText(expectedValueLabel)).toBeTruthy();
    });

    test('should open panel with rendered options', async () => {
      const placeholder = 'placeholder text';

      const user = Arrange.setupUserEvent();

      const result = await Arrange.setupSingleSelectAsMaterialFormField({
        placeholder,
        options: Arrange.createOptions(),
        value: null,
      });
      result.fixture.autoDetectChanges();

      const trigger = result.getByText(placeholder);
      await user.click(trigger);

      const options = ElementQuery.allOptionComponents(result);

      expect(options.length).toBeGreaterThan(1);
    });

    test('should select option on click', async () => {
      const placeholder = 'placeholder text';
      const options = Arrange.createOptions();
      const user = Arrange.setupUserEvent();

      const result = await Arrange.setupSingleSelectAsMaterialFormField({
        placeholder,
        options,
        value: null,
      });
      const wrapperComponent = Arrange.getWrapperComponent(result);
      result.fixture.autoDetectChanges();

      const trigger = result.getByText(placeholder);
      await user.click(trigger);

      const optionsDebugElements = ElementQuery.allOptionComponents(result);

      expect(optionsDebugElements.length).toBeGreaterThan(4);

      await user.click(optionsDebugElements[0].nativeElement);

      expect(wrapperComponent.value).toBe(options[0].value);
    });
  });

  describe('as a multi select control', () => {
    test('should render empty field wth placeholder', async () => {
      const expectedPlaceholder = 'placeholder';

      const result = await Arrange.setupMultiSelectAsMaterialFormField({
        placeholder: expectedPlaceholder,
        options: Arrange.createOptions(),
        value: null,
      });

      expect(result.getByText(expectedPlaceholder)).toBeTruthy();
    });

    test('should open panel with rendered options', async () => {
      const expectedPlaceholder = 'multi placeholder';
      const options = Arrange.createOptions();

      const expectedValues = [options[1].value, options[3].value];
      const expectedText = `${options[1].label}, ${options[3].label}`;

      const user = Arrange.setupUserEvent();

      const result = await Arrange.setupMultiSelectAsMaterialFormField({
        placeholder: expectedPlaceholder,
        options,
        value: expectedValues,
      });
      result.fixture.autoDetectChanges();

      const trigger = result.getByText(expectedText);
      await user.click(trigger);

      const optionElements = ElementQuery.allOptionComponents(result);

      expect(result.queryByText(expectedPlaceholder)).toBeFalsy();
      expect(result.getByText(expectedText)).toBeTruthy();
      expect(optionElements.length).toBeGreaterThan(1);
    });

    test('should select new item on click panel with rendered options', async () => {
      const expectedPlaceholder = 'multi placeholder';
      const options = Arrange.createOptions();
      const expectedValues = [
        options[1].value,
        options[3].value,
        options[2].value,
      ];
      const expectedTrigger = `${options[1].label}, ${options[3].label}, ${options[2].label}`;

      const user = Arrange.setupUserEvent();
      const result = await Arrange.setupMultiSelectAsMaterialFormField({
        placeholder: expectedPlaceholder,
        options,
        value: null,
      });
      const wrapperComponent = Arrange.getWrapperComponent(result);
      result.fixture.autoDetectChanges();

      const trigger = result.getByText(expectedPlaceholder);
      await user.click(trigger);

      const optionElements = ElementQuery.allOptionComponents(result);
      await user.click(optionElements[1].nativeElement);
      await user.click(optionElements[3].nativeElement);
      await user.click(optionElements[2].nativeElement);

      expect(wrapperComponent.value).toEqual(expectedValues);
      expect(result.getByText(expectedTrigger)).toBeTruthy();
    });
  });

  describe('as a control value accessor', () => {
    test('should bind to form control', async () => {
      const expectedValue = 'fooValue';

      const result = await render(
        `
          <ngx-virtual-select-field [formControl]="control" [placeholder]="placeholder">
            <ngx-virtual-select-field-option
              *ngxVirtualSelectFieldOptionFor="let option of options"
              [value]="option.value"
            >
              {{ option.label }}
            </ngx-virtual-select-field-option>
        `,

        {
          componentProperties: {
            options: [{ label: 'foo', value: 'fooValue' }],
            control: new FormControl(expectedValue),
          },
          imports: [
            ReactiveFormsModule,
            MatFormFieldModule,
            NgxVirtualSelectFieldComponent,
            NgxVirtualSelectFieldOptionForDirective,
            NgxVirtualSelectFieldOptionComponent,
            NgxVirtualSelectFieldTriggerDirective,
          ],
        }
      );

      const trigger = await result.findByText('foo');

      expect(trigger).toBeTruthy();
    });
  });
});

const Arrange = {
  async setupSingleSelectAsMaterialFormField<TValue>(componentProperties: {
    placeholder: string;
    options: NgxVirtualSelectFieldOptionModel<TValue>[];
    value: TValue;
  }): Promise<RenderResult<{ value: TValue }>> {
    return await render(
      `
      <mat-form-field>
        <ngx-virtual-select-field [value]="value" (valueChange)="value = $event" [placeholder]="placeholder" [multiple]="multiple">
          <ngx-virtual-select-field-option
            *ngxVirtualSelectFieldOptionFor="let option of options"
            [value]="option.value"
          >
            {{ option.label }}
          </ngx-virtual-select-field-option>
        </ngx-virtual-select-field>
      </mat-form-field>`,
      {
        componentProperties: {
          ...componentProperties,
        },
        imports: [
          MatFormFieldModule,
          NgxVirtualSelectFieldComponent,
          NgxVirtualSelectFieldOptionForDirective,
          NgxVirtualSelectFieldOptionComponent,
          NgxVirtualSelectFieldTriggerDirective,
        ],
      }
    );
  },

  async setupMultiSelectAsMaterialFormField<TValue>(componentProperties: {
    placeholder: string;
    options: NgxVirtualSelectFieldOptionModel<TValue>[];
    value: TValue[] | null;
  }): Promise<RenderResult<{ value: TValue[] | null; multiple: boolean }>> {
    return await render(
      `
      <mat-form-field>
        <ngx-virtual-select-field [value]="value" (valueChange)="value = $event" [placeholder]="placeholder" [multiple]="multiple">
          <ngx-virtual-select-field-option
            *ngxVirtualSelectFieldOptionFor="let option of options"
            [value]="option.value"
          >
            {{ option.label }}
          </ngx-virtual-select-field-option>
        </ngx-virtual-select-field>
      </mat-form-field>`,
      {
        componentProperties: {
          multiple: true,
          ...componentProperties,
        },
        imports: [
          MatFormFieldModule,
          NgxVirtualSelectFieldComponent,
          NgxVirtualSelectFieldOptionForDirective,
          NgxVirtualSelectFieldOptionComponent,
          NgxVirtualSelectFieldTriggerDirective,
        ],
      }
    );
  },

  getWrapperComponent<TValue>(
    render: RenderResult<unknown, { value: TValue }>
  ) {
    return render.fixture.componentInstance;
  },

  setupUserEvent() {
    return userEvent.setup();
  },

  createOptions(amount = 100): NgxVirtualSelectFieldOptionModel<number>[] {
    return new Array(amount).fill(null).map((_, index) => ({
      value: index,
      label: `${index} Option`,
      disabled: index % 5 === 0,
    }));
  },
};

const ElementQuery = {
  allOptionComponents(renderResult: RenderResult<unknown, unknown>) {
    return renderResult.debugElement.queryAll(
      By.directive(NgxVirtualSelectFieldOptionComponent)
    );
  },

  cdkViewPort(renderResult: RenderResult<unknown, unknown>) {
    return renderResult.debugElement.query(
      By.directive(CdkVirtualScrollViewport)
    );
  },
};

