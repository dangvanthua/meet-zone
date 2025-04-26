import { Routes } from '@angular/router';
import { HomeComponent } from './client/home/home.component';
import { AccountComponent } from './client/account/account.component';
import { MeetingComponent } from './client/meeting/meeting.component';
import { RoomComponent } from './client/room/room.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'account', component: AccountComponent},
    {path: 'meeting/:id', component: MeetingComponent},
    {path: 'meeting/:id/room', component: RoomComponent},
];
