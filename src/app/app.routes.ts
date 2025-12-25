import {Routes} from '@angular/router';
import {AuthPage} from './features/auth/pages/auth.page/auth.page';
import {ResultsPage} from './features/results/pages/results.page/results.page';
import {VotingPage} from './features/voting/pages/voting.page/voting.page';
import {isAdminGuard} from './core/guards/is-admin.guard';
import {redirectOnAuthGuard} from './core/guards/redirect-on-auth.guard';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthPage,
    canActivate: [redirectOnAuthGuard],
  },
  {
    path: 'voting',
    component: VotingPage,
    canActivate: [authGuard]
  },
  {
    path: 'results',
    component: ResultsPage,
    canActivate: [authGuard, isAdminGuard]
  },
  {path: '**', redirectTo: '/', pathMatch: 'full'}
];
