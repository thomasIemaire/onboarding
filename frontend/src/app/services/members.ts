import { Injectable } from '@angular/core';
import { Member } from '../core/models/member';

@Injectable({
  providedIn: 'root',
})
export class Members {
  private members: Member[] = [
    { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com', role: 'admin' },
    { nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@email.com', role: 'membre' },
    { nom: 'Durand', prenom: 'Pierre', email: 'pierre.durand@email.com', role: 'membre' },
  ];

  getMembers(): Member[] {
    return this.members;
  }

  addMember(member: Member): void {
    this.members.push(member);
  }
}
