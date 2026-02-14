import { Routes } from '@angular/router';
import { MembersComponent } from './pages/members/members';

export const routes: Routes = [
    { path: 'members', component: MembersComponent },
    { path: '', redirectTo: 'members', pathMatch: 'full' }
];
