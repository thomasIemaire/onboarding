import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-select-field',
    imports: [SelectModule, FormsModule],
    templateUrl: './select-field.html',
    styleUrl: './select-field.scss',
})
export class SelectFieldComponent {
    @Input() options: any[] = [];
    @Input() selected: any = null;
    @Output() valueChange = new EventEmitter<any>();

    onSelect(): void {
        this.valueChange.emit(this.selected);
    }
}
