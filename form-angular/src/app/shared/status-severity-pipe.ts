import { Pipe, PipeTransform } from '@angular/core';
import { MemberStatus } from '../core/models/member';

@Pipe({
    name: 'statusSeverity',
})
export class StatusSeverityPipe implements PipeTransform {
    transform(value: MemberStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (value) {
            case 'admin':
                return 'danger';
            case 'editeur':
                return 'warn';
            case 'lecteur':
                return 'info';
            default:
                return 'secondary';
        }
    }
}
