import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * A guard that checks if a user is an admin.
 * If not, it redirects them to the home page.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true; // if user is an admin, allow access
  }

  // if user is not an admin, redirect to home
  router.navigate(['/']);
  return false;
};