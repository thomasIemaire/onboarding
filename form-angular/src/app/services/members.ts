import { Injectable } from '@angular/core';
import { Member } from '../core/models/member';

@Injectable({
    providedIn: 'root',
})
export class MembersService {
    private members: Member[] = [
        { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com', status: 'admin' },
        { nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@email.com', status: 'editeur' },
        { nom: 'Durand', prenom: 'Pierre', email: 'pierre.durand@email.com', status: 'lecteur' },
    ];

    getMembers(): Member[] {
        return this.members;
    }

    addMember(member: Member): void {
        this.members.push(member);
    }
}
