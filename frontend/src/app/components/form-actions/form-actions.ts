import { Component, Input } from '@angular/core';
import { FormActionsConfig } from '../../core/models/form-actions';
import { Action } from '../action/action';

@Component({
  selector: 'app-form-actions',
  imports: [Action],
  templateUrl: './form-actions.html',
  styleUrl: './form-actions.scss',
})
export class FormActions {
  @Input({ required: true }) config!: FormActionsConfig;
}
