import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot
} from "@angular/router";

import { AuthService } from "../service/auth.service";

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const loginService = inject(AuthService);
  const router = inject(Router);
  const loadedUser = loginService.loadUserFromSession();
  if (loadedUser?.jwt_token) {
    return checkRouteAccess(loadedUser.role, state.url);
  }
  return router.navigate(["/login"]);
};

function checkRouteAccess(userRole: string, routeUrl: string): boolean {
  if (routeUrl.includes(userRole)) {
    return true;
  }
  return false;
}
