import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldConfig } from '../../core/models/field';
import { SelectField } from '../select-field/select-field';
import { TextField } from '../text-field/text-field';

@Component({
  selector: 'app-field',
  imports: [TextField, SelectField],
  templateUrl: './field.html',
  styleUrl: './field.scss',
})
export class Field {
  @Input({ required: true }) field!: FieldConfig;
  @Input() submitted: boolean = false;
  @Output() fieldValueChange = new EventEmitter<{ key: string; value: any }>();

  value: any = null;

  onValueChange(value: any) {
    this.value = value;
    this.fieldValueChange.emit({ key: this.field.key, value: value });
  }

  get showError(): boolean {
    return this.submitted && !!this.field.required && !this.value;
  }
}
