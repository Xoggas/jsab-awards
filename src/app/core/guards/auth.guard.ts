import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {Auth, authState} from '@angular/fire/auth';
import {map} from 'rxjs';

export const authGuard: CanActivateChildFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    map(user => {
      if (!user) {
        router.navigate(['/']).then(_ => {
        });
        return false;
      }

      return true;
    })
  );
};
