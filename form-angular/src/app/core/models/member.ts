export type MemberStatus = 'lecteur' | 'editeur' | 'admin';

export interface Member {
    nom: string;
    prenom: string;
    email: string;
    status: MemberStatus;
}
