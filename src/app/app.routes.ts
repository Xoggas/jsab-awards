import {Routes} from '@angular/router';
import {AuthPage} from './features/auth/pages/auth.page/auth.page';
import {ResultsPage} from './features/results/pages/results.page/results.page';
import {VotingPage} from './features/voting/pages/voting.page/voting.page';
import {isAdminGuard} from './core/guards/is-admin.guard';
import {redirectOnAuthGuard} from './core/guards/redirect-on-auth.guard';
import {authGuard} from './core/guards/auth.guard';
import {hasVotingEndedGuard} from './core/guards/has-voting-ended.guard';
import {VotingEndedPage} from './features/voting/pages/voting-ended.page/voting-ended.page';

export const routes: Routes = [
  {
    path: '',
    component: AuthPage,
    canActivate: [redirectOnAuthGuard, hasVotingEndedGuard],
  },
  {
    path: 'results',
    component: ResultsPage,
    canActivate: [authGuard, isAdminGuard]
  },
  {
    path: 'voting',
    component: VotingPage,
    canActivate: [authGuard, hasVotingEndedGuard]
  },
  {
    path: 'voting-ended',
    component: VotingEndedPage,
  },
  {path: '**', redirectTo: '/', pathMatch: 'full'}
];
