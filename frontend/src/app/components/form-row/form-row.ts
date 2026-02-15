import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormRowConfig } from '../../core/models/form-row';
import { Field } from '../field/field';

@Component({
  selector: 'app-form-row',
  imports: [Field],
  templateUrl: './form-row.html',
  styleUrl: './form-row.scss',
})
export class FormRow {
  @Input({ required: true }) row!: FormRowConfig;
  @Input() submitted: boolean = false;
  @Output() fieldValueChange = new EventEmitter<{ key: string; value: any }>();

  onFieldValueChange(event: { key: string; value: any }): void {
    this.fieldValueChange.emit(event);
  }
}
