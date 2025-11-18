import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { ClubDashboardPageComponent } from './features/private/club-management/club-dashboard.page';
import { ProfilePageComponent } from './features/private/profile/profile.page';
import { ReportResultPageComponent } from './features/private/matches/report-result.page';
import { ClubDetailsPageComponent } from './features/public/clubs/club-details.page';
import { HomePageComponent } from './features/public/home/home.page';
import { RegistrationPageComponent } from './features/public/registration/registration.page';
import { RegistrationSuccessPageComponent } from './features/public/registration/registration-success.page';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Standings' },
  { path: 'register', component: RegistrationPageComponent, title: 'Register' },
  { path: 'register/success', component: RegistrationSuccessPageComponent, title: 'Registration complete' },
  { path: 'clubs/:clubId', component: ClubDetailsPageComponent, title: 'Club detail' },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [authGuard],
    title: 'My profile',
  },
  {
    path: 'club/manage',
    component: ClubDashboardPageComponent,
    canActivate: [authGuard],
    title: 'Club management',
  },
  {
    path: 'matches/report',
    component: ReportResultPageComponent,
    canActivate: [authGuard],
    title: 'Report result',
  },
  { path: '**', redirectTo: '' },
];
