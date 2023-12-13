import { ListKeyManagerOption } from '@angular/cdk/a11y';

export interface VirtualSelectFieldOptionModel<TValue>
  extends ListKeyManagerOption {
  label: string;
  value: TValue;
}
