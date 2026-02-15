import { Pipe, PipeTransform } from '@angular/core';
import { MemberRole } from '../../core/models/member';

@Pipe({
  name: 'roleSeverity',
})
export class RoleSeverityPipe implements PipeTransform {
  transform(value: MemberRole): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (value) {
      case 'admin':
        return 'danger';
      case 'membre':
        return 'info';
      default:
        return 'secondary';
    }
  }
}