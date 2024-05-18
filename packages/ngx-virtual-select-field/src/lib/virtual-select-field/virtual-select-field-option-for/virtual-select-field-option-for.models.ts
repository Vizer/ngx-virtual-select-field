import { ListKeyManagerOption } from '@angular/cdk/a11y';

export interface NgxVirtualSelectFieldOptionModel<TValue>
  extends ListKeyManagerOption {
  /**
   * The visible text of the option.
   */
  label: string;

  /**
   * The value of the option.
   */
  value: TValue;
}
