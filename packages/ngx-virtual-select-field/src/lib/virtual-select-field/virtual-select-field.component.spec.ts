import { MatFormFieldModule } from '@angular/material/form-field';
import { render } from '@testing-library/angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { NgxVirtualSelectFieldOptionForDirective } from './virtual-select-field-option-for';
import { NgxVirtualSelectFieldComponent } from './virtual-select-field.component';

describe('VirtualSelectFieldComponent', () => {
  describe('as a mat-form-field-control', () => {
    it('should render field in material form field', async () => {
      const expectedPlaceholder = 'test placeholder';

      const result = await render(
        `
        <mat-form-field>
          <mat-label>Test Field</mat-label>
          <ngx-virtual-select-field [placeholder]="placeholder">
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
            options: [{ label: 'foo' }],
            placeholder: expectedPlaceholder,
          },
          imports: [
            MatFormFieldModule,
            NgxVirtualSelectFieldComponent,
            NgxVirtualSelectFieldOptionForDirective,
          ],
        }
      );

      expect(result.getByText('Test Field')).toBeTruthy();
      expect(result.getByText(expectedPlaceholder)).toBeTruthy();
    });
  });

  describe('as a control value accessor', () => {
    it('should bind to form control', async () => {
      const expectedValue = 'foo';

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
            control: new FormControl(expectedValue),
          },
          imports: [
            ReactiveFormsModule,
            NgxVirtualSelectFieldComponent,
            NgxVirtualSelectFieldOptionForDirective,
          ],
        }
      );

      const childComponentInstance = result.fixture.debugElement.query(
        By.directive(NgxVirtualSelectFieldComponent)
      ).componentInstance;

      expect(childComponentInstance.value).toBe(expectedValue);
    });
  });
});