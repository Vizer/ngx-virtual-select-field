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
