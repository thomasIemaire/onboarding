import { Component, Input } from '@angular/core';
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
}
