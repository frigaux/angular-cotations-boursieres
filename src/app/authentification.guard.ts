import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthentificationService } from './services/authentification/authentification.service';

export const authentificationGuard: CanActivateFn = (route, state) => {
  const authentificationService = inject(AuthentificationService);
  if (authentificationService.isAuthentifie()) {
    return true;
  } else {
    const router = inject(Router);
    router.navigate(['/authentification']);
    return false;
  }
};
