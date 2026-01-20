import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const hasVotingEndedGuard: CanActivateChildFn = async () => {
  const router = inject(Router);
  const votingEndDate = new Date(2026, 0, 25, 0, 0, 0, 0).getTime();
  const currentTime = Date.now();

  if (currentTime < votingEndDate) {
    return true;
  }

  return router.createUrlTree(['/voting-ended']);
};
