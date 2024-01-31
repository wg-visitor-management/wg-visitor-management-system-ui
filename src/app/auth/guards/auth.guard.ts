import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../service/auth.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const loginService = inject(AuthService);

  return loginService.currentUser$.pipe(
    take(1),
    map((user) => {
      const isValidUser = !!user;
      if (!isValidUser) {
        console.log('User is not logged in');
        return router.createUrlTree(['/login']);
      }
      console.log('User is logged in');
      return true;
    })
  );
};
