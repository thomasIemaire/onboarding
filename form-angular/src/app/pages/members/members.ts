import { Component, inject } from '@angular/core';
import { FormComponent } from '../../components/form/form';
import { FormConfig } from '../../core/models/form';
import { Member } from '../../core/models/member';
import { MembersService } from '../../services/members';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-members',
    imports: [FormComponent, TableModule],
    templateUrl: './members.html',
    styleUrl: './members.scss',
})
export class MembersComponent {
    private membersService = inject(MembersService);
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
                        key: 'status',
                        type: 'select',
                        label: 'Statut',
                        options: ['lecteur', 'editeur', 'admin'],
                        default: 'lecteur'
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
                    command: () => {}
                }
            ]
        }
    };

    addMember(values: Record<string, any>): void {
        const member: Member = {
            nom: values['nom'],
            prenom: values['prenom'],
            email: values['email'],
            status: values['status'] ?? 'lecteur',
        };
        this.membersService.addMember(member);
    }
}
