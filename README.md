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
    import { LibVirtualSelectFieldBundle } from 'ngx-virtual-select-field';
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
      <ngx-virtual-select-field [value]="value" (valueChange)="value = $event">
        <ngx-virtual-select-field-option *ngxVirtualSelectFieldOptionFor="let option of options" [value]="option.value"> 
          {{ option.label }}
        </ngx-virtual-select-field-option>
      </ngx-virtual-select-field>
    </mat-form-field>
    ```
1. Include theme
    ```scss
    @use 'ngx-virtual-select-field/theme' as theme;


    @include theme.inherit-material-theme(); // this will inherit css variables from material theme

    // or

    @include theme.create-default-theme(); // this will create default dark theme
    ```
