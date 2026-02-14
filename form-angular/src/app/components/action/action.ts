import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ActionConfig } from '../../core/models/action';

@Component({
    selector: 'app-action',
    imports: [ButtonModule],
    templateUrl: './action.html',
    styleUrl: './action.scss',
})
export class ActionComponent {
    @Input({ required: true }) action!: ActionConfig;
}
