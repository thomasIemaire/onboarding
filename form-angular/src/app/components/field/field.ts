import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TextFieldComponent } from '../text-field/text-field';
import { SelectFieldComponent } from '../select-field/select-field';
import { FieldConfig } from '../../core/models/field';

@Component({
    selector: 'app-field',
    imports: [TextFieldComponent, SelectFieldComponent],
    templateUrl: './field.html',
    styleUrl: './field.scss',
})
export class FieldComponent {
    @Input({ required: true }) field!: FieldConfig;
    @Input() submitted: boolean = false;
    @Output() fieldValueChange = new EventEmitter<{ key: string; value: any }>();

    value: any = '';

    onValueChange(val: any): void {
        this.value = val;
        this.fieldValueChange.emit({ key: this.field.key, value: val });
    }

    get showError(): boolean {
        return this.submitted && !!this.field.required && !this.value;
    }
}
