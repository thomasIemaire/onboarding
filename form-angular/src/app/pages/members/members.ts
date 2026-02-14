import { Component } from '@angular/core';
import { FormComponent } from '../../components/form/form';
import { FormConfig } from '../../core/models/form';
import { Member } from '../../core/models/member';

@Component({
    selector: 'app-members',
    imports: [FormComponent],
    templateUrl: './members.html',
    styleUrl: './members.scss',
})
export class MembersComponent {
    members: Member[] = [];

    formConfig: FormConfig = {
        title: 'Ajouter un membre',
        rows: [
            {
                fields: [
                    { type: 'text', label: 'Nom', required: true },
                    { type: 'text', label: 'Prénom', required: true }
                ]
            },
            {
                fields: [
                    { type: 'text', label: 'Email', required: true }
                ]
            },
            {
                fields: [
                    {
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
                    command: () => this.addMember()
                }
            ]
        }
    };

    addMember(): void {
        // TODO: récupérer les valeurs du formulaire et ajouter le membre
    }
}
