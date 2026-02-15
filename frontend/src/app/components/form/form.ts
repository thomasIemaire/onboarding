import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormConfig } from '../../core/models/form';
import { FormActions } from '../form-actions/form-actions';
import { FormRow } from '../form-row/form-row';

@Component({
  selector: 'app-form',
  imports: [FormRow, FormActions],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
  @Input({ required: true }) config!: FormConfig;
  @Output() formSubmit = new EventEmitter<Record<string, any>>();

  submitted: boolean = false;
  values: Record<string, any> = {};

  onFieldValueChange(event: { key: string; value: any }): void {
    this.values[event.key] = event.value;
  }

  onSubmit(): void {
    this.submitted = true;

    const hasErrors = this.config.rows
      .flatMap(row => row.fields)
      .some(field => field.required && !this.values[field.key]);

    if (!hasErrors) {
      this.formSubmit.emit({ ...this.values });
    }
  }
}
