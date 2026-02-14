import { Component, Input } from '@angular/core';
import { FieldComponent } from '../field/field';
import { FormRowConfig } from '../../core/models/form-row';

@Component({
    selector: 'app-form-row',
    imports: [FieldComponent],
    templateUrl: './form-row.html',
    styleUrl: './form-row.scss',
})
export class FormRowComponent {
    @Input({ required: true }) row!: FormRowConfig;
    @Input() submitted: boolean = false;
}
