import {Routes} from '@angular/router';
import {MainLayout} from './core/layout/main-layout/main-layout';
import {AuthPage} from './features/auth/pages/auth.page/auth.page';
import {RemixCandidatesPage} from './features/voting/pages/remix-candidates.page/remix-candidates.page';
import {ArtCandidatesPage} from './features/voting/pages/art-candidates.page/art-candidates.page';
import {LevelCandidatesPage} from './features/voting/pages/level-candidates.page/level-candidates.page';
import {AnimatorCandidatesPage} from './features/voting/pages/animator-candidates.page/animator-candidates.page';
import {AnimationCandidatesPage} from './features/voting/pages/animation-candidates.page/animation-candidates.page';
import {ResultsPage} from './features/results/pages/results.page/results.page';
import {isAdminGuard} from './core/guards/is-admin.guard';
import {alreadyAuthorizedGuard} from './core/guards/already-authorized.guard';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthPage,
    canActivate: [alreadyAuthorizedGuard],
  },
  {
    path: 'voting',
    component: MainLayout,
    children: [
      {path: 'remixes', component: RemixCandidatesPage},
      {path: 'arts', component: ArtCandidatesPage},
      {path: 'levels', component: LevelCandidatesPage},
      {path: 'animators', component: AnimatorCandidatesPage},
      {path: 'animations', component: AnimationCandidatesPage},
      {path: 'results', component: ResultsPage, canActivate: [isAdminGuard]}
    ],
    canActivate: [authGuard]
  },
  {path: '**', redirectTo: '/', pathMatch: 'full'}
];
