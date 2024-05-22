import { RenderResult, render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { MatPseudoCheckbox } from '@angular/material/core';
import { By } from '@angular/platform-browser';

import { NgxVirtualSelectFieldOptionComponent } from './virtual-select-field-option.component';
import { NGX_VIRTUAL_SELECT_FIELD_OPTION_PARENT } from './virtual-select-field-option.models';

describe('NgxVirtualSelectFieldOptionComponent', () => {
  describe('single select', () => {
    it('should toggle selected state on click', async () => {
      const value = 112233;
      const result = await arrange.setup({ value });
      const component = arrange.findComponent(result);
      const nativeElement = arrange.findNativeElement(result);
      const emitSpy = arrange.spySelectedChangeEmit(result);

      const user = userEvent.setup();

      await user.click(result.debugElement.nativeElement);
      result.fixture.detectChanges();

      const checkbox = arrange.findCheckbox(result);

      expect(checkbox.componentInstance.state).toBe('checked');
      expect(emitSpy).toHaveBeenCalledWith({
        value,
        selected: true,
        source: component,
      });
      expect(
        nativeElement.classList.contains(asserts.expects.selectedClass)
      ).toBe(true);
    });

    it('should not toggle selected state on click when disabled', async () => {
      const result = await arrange.setup({ disabled: true });
      const component = arrange.findComponent(result);
      const nativeElement = arrange.findNativeElement(result);
      const emitSpy = arrange.spySelectedChangeEmit(result);

      const user = userEvent.setup();

      await user.click(result.debugElement.nativeElement);

      const checkbox = arrange.findCheckbox(result);

      expect(checkbox).toBeFalsy();
      expect(component.disabled).toBe(true);
      expect(emitSpy).not.toHaveBeenCalled();
      expect(
        nativeElement.classList.contains(asserts.expects.disabledClass)
      ).toBe(true);
      expect(
        nativeElement.classList.contains(asserts.expects.selectedClass)
      ).toBe(false);
    });
  });

  describe('multiple select', () => {
    it('should toggle selected state on click', async () => {
      const value = 332211;
      const result = await arrange.setup({ multiple: true, value });
      const component = arrange.findComponent(result);
      const nativeElement = arrange.findNativeElement(result);
      const emitSpy = arrange.spySelectedChangeEmit(result);

      const user = userEvent.setup();

      await user.click(result.debugElement.nativeElement);
      result.fixture.detectChanges();

      const checkbox = arrange.findCheckbox(result);

      expect(checkbox.componentInstance.state).toBe('checked');
      expect(emitSpy).toHaveBeenCalledWith({
        value,
        selected: true,
        source: component,
      });
      expect(
        nativeElement.classList.contains(asserts.expects.selectedClass)
      ).toBe(true);
      expect(
        nativeElement.classList.contains(asserts.expects.multipleClass)
      ).toBe(true);
    });

    it('should toggle selected state on click when already selected', async () => {
      const value = 123123;
      const result = await arrange.setup({ multiple: true, value });
      const component = arrange.findComponent(result);
      const nativeElement = arrange.findNativeElement(result);
      const emitSpy = arrange.spySelectedChangeEmit(result);

      const user = userEvent.setup();

      await user.click(result.debugElement.nativeElement);
      await user.click(result.debugElement.nativeElement);

      const checkbox = arrange.findCheckbox(result);

      expect(checkbox.componentInstance.state).toBe('unchecked');
      expect(emitSpy).toHaveBeenCalledWith({
        value,
        selected: true,
        source: component,
      });
      expect(emitSpy).toHaveBeenCalledWith({
        value,
        selected: false,
        source: component,
      });
      expect(
        nativeElement.classList.contains(asserts.expects.selectedClass)
      ).toBe(false);
      expect(
        nativeElement.classList.contains(asserts.expects.multipleClass)
      ).toBe(true);
    });
  });

  describe('highlightable', () => {
    it('#setActiveStyles should set active styles', async () => {
      const result = await arrange.setup();
      const component = arrange.findComponent(result);
      const nativeElement = arrange.findNativeElement(result);

      component.setActiveStyles();
      result.fixture.detectChanges();

      expect(
        nativeElement.classList.contains(asserts.expects.activeClass)
      ).toBe(true);
    });

    it('#setInactiveStyles should set inactive styles', async () => {
      const result = await arrange.setup();
      const component = arrange.findComponent(result);
      const nativeElement = arrange.findNativeElement(result);

      component.setActiveStyles();
      component.setInactiveStyles();
      result.fixture.detectChanges();

      expect(
        nativeElement.classList.contains(asserts.expects.activeClass)
      ).toBe(false);
    });
  });

  describe('selectable', () => {
    it('#select should set selected to true', async () => {
      const result = await arrange.setup();
      const component = arrange.findComponent(result);
      const nativeElement = arrange.findNativeElement(result);

      component.select();
      result.fixture.detectChanges();

      expect(
        nativeElement.classList.contains(asserts.expects.selectedClass)
      ).toBe(true);
    });

    it('#deselect should set selected to false', async () => {
      const result = await arrange.setup();
      const component = arrange.findComponent(result);
      const nativeElement = arrange.findNativeElement(result);

      component.select();
      component.deselect();
      result.fixture.detectChanges();

      expect(
        nativeElement.classList.contains(asserts.expects.selectedClass)
      ).toBe(false);
    });
  });
});

const arrange = {
  async setup({ multiple = false, value = 123, disabled = false } = {}) {
    return render(NgxVirtualSelectFieldOptionComponent<number>, {
      providers: [
        {
          provide: NGX_VIRTUAL_SELECT_FIELD_OPTION_PARENT,
          useValue: {
            multiple,
          },
        },
      ],
      componentProperties: {
        value,
        disabled,
      },
    });
  },
  findCheckbox(
    result: RenderResult<NgxVirtualSelectFieldOptionComponent<number>>
  ) {
    return result.fixture.debugElement.query(By.directive(MatPseudoCheckbox));
  },

  findComponent(
    result: RenderResult<NgxVirtualSelectFieldOptionComponent<number>>
  ): NgxVirtualSelectFieldOptionComponent<number> {
    return result.fixture.componentInstance;
  },

  findNativeElement(
    result: RenderResult<NgxVirtualSelectFieldOptionComponent<number>>
  ) {
    return result.debugElement.nativeElement;
  },

  spySelectedChangeEmit(
    result: RenderResult<NgxVirtualSelectFieldOptionComponent<number>>
  ) {
    return jest.spyOn(result.fixture.componentInstance.selectedChange, 'emit');
  },
};

const asserts = {
  expects: {
    disabledClass: 'ngx-virtual-select-field-option--disabled',
    selectedClass: 'ngx-virtual-select-field-option--selected',
    multipleClass: 'ngx-virtual-select-field-option--multiple',
    activeClass: 'ngx-virtual-select-field-option--active',
  },
};
