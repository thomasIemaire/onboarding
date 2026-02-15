import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-text-field',
  imports: [InputTextModule, FormsModule],
  templateUrl: './text-field.html',
  styleUrl: './text-field.scss',
})
export class TextField {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  onInput(): void {
    this.valueChange.emit(this.value);
  }
}
