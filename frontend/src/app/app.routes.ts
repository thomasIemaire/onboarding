import { Routes } from '@angular/router';
import { Members } from './pages/members/members';

export const routes: Routes = [
    { path: 'members', component: Members },
    { path: '', redirectTo: 'members', pathMatch: 'full' }
];