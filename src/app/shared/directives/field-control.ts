import { Directive, Input } from '@angular/core';

@Directive()
export abstract class FieldControl {
  @Input() id = '';
  abstract setId(id: string): void;
}
