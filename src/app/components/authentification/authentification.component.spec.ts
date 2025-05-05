import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthentificationComponent} from './authentification.component';
import {AuthentificationService} from '../../services/authentification/authentification.service';
import {Observable} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';

describe('AuthentificationComponent', () => {
  let component: AuthentificationComponent;
  let fixture: ComponentFixture<AuthentificationComponent>;

  const mockAuthentificationService = jasmine.createSpyObj('AuthentificationService', ['authentifier']);

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        AuthentificationComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: AuthentificationService, useValue: mockAuthentificationService}
      ]
    });

    fixture = TestBed.createComponent(AuthentificationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('Given le composant est crée when #ngOnInit n\'est pas encore appelée then le statut est AUTHENTIFICATION', () => {
    expect(component.statut).toBe(component.enumStatut.AUTHENTIFICATION);
  });

  it('Given le composant est crée when #ngOnInit est appelée et que l\'authentification échoue then le statut est ERREUR', async () => {
    mockAuthentificationService.authentifier.and.returnValue(new Observable(observer => {
      observer.error({url: 'u', status: 's'});
    }));
    component.ngOnInit();
    fixture.detectChanges(); // pour essayer de s'assurer que le error sur l'observable a bien été traité
    expect(component.statut).toBe(component.enumStatut.ERREUR);
  });

  it('Given le composant est crée when #ngOnInit est appelée et que l\'authentification réussie then le statut est SUCCES', async () => {
    mockAuthentificationService.authentifier.and.returnValue(new Observable(observer => {
      observer.complete();
    }));
    component.ngOnInit();
    fixture.detectChanges(); // pour essayer de s'assurer que le complete sur l'observable a bien été traité
    expect(component.statut).toBe(component.enumStatut.SUCCES);
  });
});
