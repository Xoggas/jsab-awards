import {CanActivateChildFn} from '@angular/router';

export const isAdminGuard: CanActivateChildFn = () => {
  return true;
};
