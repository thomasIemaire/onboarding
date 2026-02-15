import { Component, Input } from '@angular/core';
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
}
