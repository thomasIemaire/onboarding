import { Component, Input } from '@angular/core';
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
    submitted: boolean = false;

    onSubmit(): void {
        this.submitted = true;
    }
}
