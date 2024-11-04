<span><a href="https://www.npmjs.com/package/ngx-virtual-select-field" title="View this project on NPM">![NPM Version](https://img.shields.io/npm/v/ngx-virtual-select-field?style=flat&logo=npm)
</a></span>
<span><a href="https://github.com/Vizer/ngx-virtual-select-field/actions/workflows/node.js.yml" title="View this project workflow">![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/vizer/ngx-virtual-select-field/node.js.yml?style=flat&logo=github&label=workflow)
</a></span>

# Virtual Select component for Angular Material Form Field

## Table of contents

- [Description](#description)
- [Getting started](#getting-started)
- [Examples](#examples)
- [Customization](#customization)
- [API](#api)
  - [NgxVirtualSelectFieldComponent<TValue>](#ngxvirtualselectfieldcomponenttvalue)
  - [NgxVirtualSelectFieldOptionComponent<TValue>](#ngxvirtualselectfieldoptioncomponenttvalue)
  - [NgxVirtualSelectFieldOptionSelectionChangeEvent<TValue>](#ngxvirtualselectfieldoptionselectionchangetvalue)
  - [NgxVirtualSelectFieldTriggerComponent](#ngxvirtualselectfieldtriggercomponent)
  - [NgxVirtualSelectFieldOptionForDirective](#ngxvirtualselectfieldoptionfordirective)
  - [NgxVirtualSelectFieldOptionModel<TValue>](#ngxvirtualselectfieldoptionmodeltvalue)
  - [NGX_VIRTUAL_SELECT_FIELD_CONFIG](#ngx_virtual_select_field_config)
  - [NgxVirtualSelectFieldConfig](#ngxvirtualselectfieldconfig)
  - [CSS variables](#css-variables)

## Description

This package replicates the Angular Material Select component with virtual scroll capabilities with help of cdk-virtual-scroll. It provides most major features of the original Angular Material Select component. The goal of this package is to provide similar api and features as the original Angular Material Select component but with virtual scroll capabilities. One major difference is that this package does not support option groups at the moment. Also, this requires own structural directive to be used for options in order to provide virtual scroll capabilities and custom template.

Features:

- Virtual scroll
- Multi select
- Single select
- Integrates with Angular Material Form Field
- Custom trigger template
- Custom option template
- Keyboard navigation and shortcuts
- Theming trough css variables

Not Supported Features for now:

- Animations
- Custom Error state mather
- Custom scroll strategy
- Accessibility
- Option groups

[Demo](https://stackblitz.com/edit/demo-ngx-virtual-select-field)

## Getting started

1. Install package

   ```bash
   npm install ngx-virtual-select-field
   ```

1. Import bundle into your component

   ```typescript
   import { NgxVirtualSelectFieldBundle } from 'ngx-virtual-select-field';
   ...
   @Component({
     imports: [
       NgxVirtualSelectFieldBundle,
       ...
     ],
     ...
   })
   ```

1. Create options collection in component. Options collection should be an array of objects with `value` and `label` properties. Optionally, you can add `disabled` property to disable specific options and `getLabel()` fot type ahead search.

    ```typescript
    ...
    protected options: NgxVirtualSelectFieldOptionModel<number>[]

    constructor() {
      this.options = new Array(100000)
        .fill(null)
        .map((_, index) => ({
          value: index,
          label: `${index} Option`,
          disabled: index % 5 === 0,
        }));
    }
   ```

1. Setup template markup. `ngxVirtualSelectFieldOptionFor` directive should be user to pass options collection to the component and provide custom option template.

   ```html
   <mat-form-field>
     <mat-label>Virtual Select Field Example</mat-label>
     <ngx-virtual-select-field [value]="value">
       <ngx-virtual-select-field-option 
        *ngxVirtualSelectFieldOptionFor="let option of options" 
        [value]="option.value"
        [disabled]="option.disabled"> 
        {{ option.label }}
      </ngx-virtual-select-field-option>
     </ngx-virtual-select-field>
   </mat-form-field>
   ```

1. Include theme styles. You can define your own theme with help of [CSS variables](#css-variables) or inherit from material theme.
    ```scss
    @use 'ngx-virtual-select-field/theme' as theme;

    @include theme.inherit-material-theme(); // this will inherit css variables from material theme
    ```

## Examples

Basic setup with value input and output binding

```html
<mat-form-field>
  <mat-label>Example</mat-label>
  <ngx-virtual-select-field [value]="value" (valueChange)="onValueChange($event)">
    <ngx-virtual-select-field-option 
      *ngxVirtualSelectFieldOptionFor="let option of options" [value]="option.value"> 
      {{ option.label }} 
    </ngx-virtual-select-field-option>
  </ngx-virtual-select-field>
</mat-form-field>
```

Form control integration

```html
<mat-form-field>
  <mat-label>Form Control Example</mat-label>
  <ngx-virtual-select-field [formControl]="formControl">
    <ngx-virtual-select-field-option 
      *ngxVirtualSelectFieldOptionFor="let option of options" [value]="option.value">
        {{ option.label }}
    </ngx-virtual-select-field-option>
  </ngx-virtual-select-field>
</mat-form-field>
```

Multi select

```html
<mat-form-field>
  <mat-label>Multi Select Example</mat-label>
  <ngx-virtual-select-field [value]="value" multiple (valueChange)="onValueChange($event)">
    <ngx-virtual-select-field-option 
      *ngxVirtualSelectFieldOptionFor="let option of options" 
      [value]="option.value"> 
      {{ option.label }} 
    </ngx-virtual-select-field-option>
  </ngx-virtual-select-field>
</mat-form-field>
```

Custom trigger template

```html
<mat-form-field class="field">
  <mat-label>Custom Trigger Example</mat-label>
  <ngx-virtual-select-field multiple [(value)]="value">
    <ngx-virtual-select-field-trigger> 
      {{ value.length }} selected 
    </ngx-virtual-select-field-trigger>
    <ngx-virtual-select-field-option 
      *ngxVirtualSelectFieldOptionFor="let option of options" 
      [value]="option.value"> 
      {{ option.label }} 
    </ngx-virtual-select-field-option>
  </ngx-virtual-select-field>
</mat-form-field>
```

## Customization

Components supports custom templates for trigger and option elements. You can use `ngx-virtual-select-field-trigger` and `ngx-virtual-select-field-option` components to define custom templates.

There are number of input parameters available to specify specific behavior of the component.

Injection tokens might be used to customize all component instances

All styles are defined with css variables, so you can easily override them in your own styles.

See more in API section below.

## API

### NgxVirtualSelectFieldComponent<TValue>

selector: `ngx-virtual-select-field`  
Component to define select field

| Input                     | Type                         | Default | Description                                                                    |
| ------------------------- | ---------------------------- | ------- | ------------------------------------------------------------------------------ |
| panelWidth                | `string\|number \|null`      | `auto`  | Width for overlay panel                                                        |
| optionHeight              | `number`                     | `48`    | Height for an option element                                                   |
| panelViewportPageSize     | `number`                     | `8`     | Amount of visible items in list                                                |
| multiple                  | `boolean`                    | `false` | Enable multiple selection                                                      |
| tabIndex                  | `number`                     | `0`     | Tab index for keyboard navigation                                              |
| typeaheadDebounceInterval | `number`                     | `300`   | Milliseconds to wait before navigating to active element after keyboard search |
| panelClass                | `string \| string[] \| null` | `null`  | CSS class to be added to the panel element                                     |
| value                     | `TValue[] \| TValue \| null` | `null`  | Value of the select field                                                      |
| placeholder               | `string`                     | none    | Placeholder for the select field                                               |
| required                  | `boolean`                    | `false` | Define if fields is required                                                   |
| disabled                  | `boolean`                    | `false` | Define if fields is disabled                                                   |

| Output          | Type                          | Description                |
| --------------- | ----------------------------- | -------------------------- |
| valueChange     | `TValue \| TValue[]`          | Value change output        |
| selectionChange | `NgxVirtualSelectFieldChange` | Selecten change output     |


### NgxVirtualSelectFieldOptionComponent<TValue>

selector: `ngx-virtual-select-field-option`  
Component to define option element

| Input            | Type      | Default | Description                    |
| ---------------- | --------- | ------- | ------------------------------ |
| value (required) | `TValue`  |         | Value of the option            |
| disabled         | `boolean` | `false` | Whether the option is disabled |

| Output         | Type                                                      | Description                  |
| -------------- | --------------------------------------------------------- | ---------------------------- |
| selectedChange | `NgxVirtualSelectFieldOptionSelectionChangeEvent<TValue>` | Option selected value change |

### NgxVirtualSelectFieldOptionSelectionChangeEvent<TValue>

Interface to define option selection change event contract  
Properties:
| Name | Type | Description |
|----------|-----------------------------------------------------------|----------------------------|
| source | `NgxVirtualSelectFieldOptionComponent<TValue>` | Option component instance |
| value | `TValue` | Value of the option |
| selected | `boolean` | Whether the option is selected |

### NgxVirtualSelectFieldTriggerComponent

selector: `ngx-virtual-select-field-trigger`  
Directive to define custom trigger template

### NgxVirtualSelectFieldOptionForDirective

selector: `*ngxVirtualSelectFieldOptionFor`  
Directive to define custom option template and iterate over options
| Input | Type | Description |
|----------------------------------|----------------------------------------------|---------------------|
| of (required) | `NgxVirtualSelectFieldOptionModel<TValue>[]` | Options collection |

### NgxVirtualSelectFieldOptionModel<TValue>

Interface to define option model contract  
Properties:
| Name | Type | Description |
|-----------------------|----------------------------------------------------------------|----------------------------|
| value | `TValue` | Value of the option |
| label | `string` | Label of the option |
| disabled? | `boolean` | Whether the option is disabled |
| getLabel() optional | `(option: NgxVirtualSelectFieldOptionModel<TValue>) => string` | Function to get label of the option |

### NGX_VIRTUAL_SELECT_FIELD_CONFIG

Injection token to define global configuration for all instances of the component
Config see in NgxVirtualSelectFieldConfig interface

### NgxVirtualSelectFieldConfig

Interface to define global configuration contract
Properties:
| Name | Type | Description |
|-----------------------|--------------------------------------------|----------------------------|
| panelWidth | `string\|number` | Width for overlay panel |
| overlayPanelClass | `string \| string[]` | CSS class to be added to the panel element|
| optionHeight | `number` | Height for an option element |
| panelViewportPageSize | `number` | Amount of visible items in list |

### NgxVirtualSelectFieldChange

Class to define event for `selectionChange` output
Properties:
| Name | Type | Description |
|-----------------------|--------------------------------------------|----------------------------|
| source | `NgxVirtualSelectFieldComponent` | isntance of the selector component |
| value | `TValue` or `TValue[]` | new selection value|


### CSS variables

All styles are defined with css variables, so you can easily override them in your own styles.
CSS variables for main component:
```scss
:root {
  --ngx-virtual-select-field-trigger-text-color: ...;
  --ngx-virtual-select-field-trigger-text-color--disabled: ...;
  --ngx-virtual-select-field-trigger-font-family: ...;
  --ngx-virtual-select-field-trigger-line-height: ...;
  --ngx-virtual-select-field-trigger-font-size: ...;
  --ngx-virtual-select-field-trigger-font-weight: ...;
  --ngx-virtual-select-field-trigger-letter-spacing: ...;

  --ngx-virtual-select-field-placeholder-text-color: ...;
  --ngx-virtual-select-field-placeholder-transition: ...;

  --ngx-virtual-select-field-arrow-size: ...;
  --ngx-virtual-select-field-arrow-color--enabled: ...;
  --ngx-virtual-select-field-arrow-color--focused: ...;
  --ngx-virtual-select-field-arrow-color--invalid: ...;
  --ngx-virtual-select-field-arrow-color--disabled: ...;

  --ngx-virtual-select-field-panel-background: ...;
  --ngx-virtual-select-field-panel-box-shadow: ...;
  --ngx-virtual-select-field-panel-list-wrapper-padding: ...;
}
```
CSS variables for option component:

```scss
:root {
  --ngx-virtual-select-field-option-color: ...;
  --ngx-virtual-select-field-option-font-family: ...;
  --ngx-virtual-select-field-option-line-height: ...;
  --ngx-virtual-select-field-option-font-size: ...;
  --ngx-virtual-select-field-option-letter-spacing: ...;
  --ngx-virtual-select-field-option-font-weight: ...;

  --ngx-virtual-select-field-option-selected-state-label-text-color: ...;
  --ngx-virtual-select-field-option-background-color--active: ...;
  --ngx-virtual-select-field-option-background-color--hover: ...;
  --ngx-virtual-select-field-option-background-color--selected: ...;

  --ngx-virtual-select-field-option-disabled-state-opacity: ...;
  --ngx-virtual-select-field-option-gap: ...;
  --ngx-virtual-select-field-option-padding: ...;
}

```
