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

## Hot to use

1. Import bundle into your component
    ```typescript
    import { LibVirtualSelectFieldBundle } from '@angular-material-virtual-select/virtual-select-field';
    ...
    @Component({
      imports: [
        LibVirtualSelectFieldBundle,
        ...
      ],
      ...
    })
    ```

1. Render in template
    ```html
    <mat-form-field>
      <mat-label>Virtual Select Field Example</mat-label>
      <lib-virtual-select-field [value]="value" (valueChange)="value = $event">
        <lib-virtual-select-field-option *libVirtualSelectFieldOptionFor="let option of options" [value]="option.value"> 
          {{ option.label }}
        </lib-virtual-select-field-option>
      </lib-virtual-select-field>
    </mat-form-field>
    ```
