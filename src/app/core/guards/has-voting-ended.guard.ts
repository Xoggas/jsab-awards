import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const hasVotingEndedGuard: CanActivateChildFn = (childRoute, state) => {
  const router = inject(Router);

  const votingEndDate = new Date(2026, 0, 18, 0, 0, 0, 0).getTime();
  const currentDate = Date.now();

  if (currentDate < votingEndDate) {
    return true;
  }

  return router.createUrlTree(['/voting-ended']);
};
