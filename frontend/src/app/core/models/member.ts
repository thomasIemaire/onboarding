export type MemberRole = 'membre' | 'admin';

export interface Member {
    nom: string;
    prenom: string;
    email: string;
    role: MemberRole;
}