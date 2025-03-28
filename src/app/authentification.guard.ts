import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthentificationService } from './services/authentification.service';

export const authentificationGuard: CanActivateFn = (route, state) => {
  const authentificationService = inject(AuthentificationService);
  return authentificationService.isAuthentifie();
};
