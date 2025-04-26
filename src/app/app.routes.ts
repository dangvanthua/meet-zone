import { Routes } from '@angular/router';
import { HomeComponent } from './client/home/home.component';
import { AccountComponent } from './client/account/account.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'account', component: AccountComponent}
];
