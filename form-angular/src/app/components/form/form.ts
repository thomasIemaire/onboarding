import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormRowComponent } from '../form-row/form-row';
import { FormActionsComponent } from '../form-actions/form-actions';
import { FormConfig } from '../../core/models/form';

@Component({
    selector: 'app-form',
    imports: [FormRowComponent, FormActionsComponent],
    templateUrl: './form.html',
    styleUrl: './form.scss',
})
export class FormComponent {
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
