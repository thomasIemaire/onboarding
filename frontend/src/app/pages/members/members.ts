import { Component, inject } from '@angular/core';
import { Form } from '../../components/form/form';
import { FormConfig } from '../../core/models/form';
import { Member } from '../../core/models/member';
import { Members as MerbersService } from '../../services/members';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-members',
  imports: [Form, TableModule],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members {
  private membersService = inject(MerbersService);
  members: Member[] = this.membersService.getMembers();

  formConfig: FormConfig = {
    title: 'Ajouter un membre',
    rows: [
      {
        fields: [
          { key: 'nom', type: 'text', label: 'Nom', required: true },
          { key: 'prenom', type: 'text', label: 'Prénom', required: true }
        ]
      },
      {
        fields: [
          { key: 'email', type: 'text', label: 'Email', required: true }
        ]
      },
      {
        fields: [
          {
            key: 'role',
            type: 'select',
            label: 'Statut',
            options: ['membre', 'admin'],
            default: 'membre'
          }
        ]
      }
    ],
    actions: {
      actions: [
        {
          label: 'Ajouter',
          severity: 'primary',
          icon: 'pi pi-plus',
          command: () => { }
        }
      ]
    }
  };

  addMember(values: Record<string, any>): void {
    const member: Member = {
      nom: values['nom'],
      prenom: values['prenom'],
      email: values['email'],
      role: values['role'] ?? 'membre',
    };
    this.membersService.addMember(member);
  }
}
