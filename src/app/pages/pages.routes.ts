import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DedicationComponent} from './dedication/dedication.component';
import {ErrorComponent} from './error/error.component';
import {InfoComponent} from './info/info.component';
import {ExpiredComponent} from './expired/expired.component';
import { AuthGuard } from '../core/guards/auth.guard';



export default [
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    {path: 'dedication', component: InfoComponent},
    {path: 'dedication/:uuid', component: DedicationComponent},
    {path: 'error', component: ErrorComponent},
    {path: 'expired', component: ExpiredComponent},
] as Routes;
