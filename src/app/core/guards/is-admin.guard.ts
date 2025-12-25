import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {Auth, authState} from '@angular/fire/auth';
import {map, of, switchMap} from 'rxjs';
import {UserService} from '../../features/auth/services/user.service';

export const isAdminGuard: CanActivateChildFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const userService = inject(UserService);

  return authState(auth).pipe(
    map(user => user?.uid),
    switchMap(uid => {
      if (!uid) {
        router.navigate(['/voting']).then(_ => {
        });
        return of(false);
      }

      return userService.getCurrentUserFromDb().then(result => {
        if (result.success && result.data.isAdmin) {
          return true;
        }
        else {
          router.navigate(['/voting']).then(_ => {
          });
          return false;
        }
      });
    })
  );
};
