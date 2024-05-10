import { ListKeyManagerOption } from '@angular/cdk/a11y';

export interface NgxVirtualSelectFieldOptionModel<TValue>
  extends ListKeyManagerOption {
  label: string;
  value: TValue;
}
