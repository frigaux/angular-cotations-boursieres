import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

import { authentificationGuard } from './authentification.guard';
import { AuthentificationService } from './services/authentification/authentification.service';

describe('authentificationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authentificationGuard(...guardParameters));

  const mockAuthentificationService = jasmine.createSpyObj('AuthentificationService', ['isAuthentifie']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthentificationService, useValue: mockAuthentificationService }
      ]
    });
  });

  it('Given est pas authentifié when on appelle CanActivateFn then authentificationGuard renvoie false', () => {
    mockAuthentificationService.isAuthentifie.and.returnValue(false);
    expect(executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)).toBeFalse();
  });

  it('Given est authentifié when on appelle CanActivateFn then authentificationGuard renvoie true', () => {
    mockAuthentificationService.isAuthentifie.and.returnValue(true);
    expect(executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)).toBeTrue();
  });
});
