import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-select-field',
  imports: [SelectModule, FormsModule],
  templateUrl: './select-field.html',
  styleUrl: './select-field.scss',
})
export class SelectField {
  @Input() options: any[] = [];
  @Input() selected: any = null;
  @Output() valueChange = new EventEmitter<any>();

  onSelect(): void {
    this.valueChange.emit(this.selected);
  }
}
