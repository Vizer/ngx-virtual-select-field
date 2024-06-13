<span><a href="https://www.npmjs.com/package/ngx-virtual-select-field" title="View this project on NPM">![NPM Version](https://img.shields.io/npm/v/ngx-virtual-select-field?style=flat&logo=npm)
</a></span>
<span><a href="https://github.com/Vizer/ngx-virtual-select-field/actions/workflows/node.js.yml" title="View this project workflow">![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/vizer/ngx-virtual-select-field/node.js.yml?style=flat&logo=github&label=workflow)
</a></span>
# Virtual Select component for Angular Material Form Field

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

[Read NgxVirtualSelectField documentation](./packages/ngx-virtual-select-field/README.md)

[Demo](https://stackblitz.com/edit/demo-ngx-virtual-select-field)

[Getting Started](./packages/ngx-virtual-select-field/README.md#getting-started)

## Example single select

```html
<mat-form-field>
  <mat-label>Example</mat-label>
  <ngx-virtual-select-field [(value)]="value">
    <ngx-virtual-select-field-option 
      *ngxVirtualSelectFieldOptionFor="let option of options"
      [value]="option.value"> 
      {{ option.label }} 
    </ngx-virtual-select-field-option>
  </ngx-virtual-select-field>
</mat-form-field>
```

[See more here](./packages/ngx-virtual-select-field//README.md#examples)
