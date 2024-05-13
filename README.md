# Virtual Select component for Angular Material Form Field

This package replicates the Angular Material Select component with virtual scroll capabilities with help of cdk-virtual-scroll. It provides most major features of the Angular Material Select component.

Features:

- Virtual scroll
- Multi select
- Single select
- Integrates with Angular Material Form Field
- Custom templates
- keyboard navigation and shortcuts
- Theming trough css variables

## Getting started

### Install package

```bash
npm install ngx-virtual-select-field
```

### Import into your component

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

### Setup template markup

```html
<mat-form-field>
  <mat-label>Virtual Select Field Example</mat-label>
  <ngx-virtual-select-field [value]="value">
    <ngx-virtual-select-field-option *ngxVirtualSelectFieldOptionFor="let option of options" [value]="option.value">
      {{ option.label }}
    </ngx-virtual-select-field-option>
  </ngx-virtual-select-field>
</mat-form-field>
```

### Include theme styles

```scss
@use 'ngx-virtual-select-field/theme' as theme;


@include theme.inherit-material-theme(); // this will inherit css variables from material theme

// or

@include theme.create-default-theme(); // this will create default dark theme
```

## Examples

Basic setup with value input and output binding

```html
<mat-form-field>
  <mat-label>Example</mat-label>
  <ngx-virtual-select-field [value]="value" (valueChange)="onValueChange($event)">
    <ngx-virtual-select-field-option *ngxVirtualSelectFieldOptionFor="let option of options" [value]="option.value">
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
    <ngx-virtual-select-field-option *ngxVirtualSelectFieldOptionFor="let option of options" [value]="option.value">
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
    <ngx-virtual-select-field-option *ngxVirtualSelectFieldOptionFor="let option of options" [value]="option.value">
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

    <ngx-virtual-select-field-option *ngxVirtualSelectFieldOptionFor="let option of options" [value]="option.value"> 
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

### NgxVirtualSelectFieldComponent  
`ngx-virtual-select-field`  
| Input                     | Type                         | Default      | Description       |
|---------------------------|------------------------------|--------------|-------------------|
| panelWidth                | `string\|number \|null`      | `auto`       |Width for overlay panel|
| optionHeight              | `number`                     | `48`         | Height of a single option item |
| panelViewportPageSize     | `number`                     | `8`          | Amount of visible items in list |
| multiple                  | `boolean`                    | `false`      | Enable multiple selection |
| tabIndex                  | `number`                     | `0`          | Tab index for keyboard navigation |
| typeaheadDebounceInterval | `number`                     | `100`        | Milliseconds to wait before navigating to active element after keyboard search |
| panelClass                | `string \| string[] \| null` | `null`       | CSS class to be added to the panel element|
| value                     | `TValue[] \| TValue \| null` | `null`       | Value of the select field |
| placeholder               | `string`                     | none         | Placeholder for the select field |
| required                  | `boolean`                    | `false`      | Define if fields is required |
| disabled                  | `boolean`                    | `false`      | Define if fields is disabled |

| Output          | Type                | Description                |
|-----------------|---------------------|----------------------------|
| valueChange     | `EventEmitter<any>` | Value change event emitter |
