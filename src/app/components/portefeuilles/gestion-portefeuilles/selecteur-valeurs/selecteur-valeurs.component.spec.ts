import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecteurValeursComponent } from './selecteur-valeurs.component';
import {TranslateModule} from '@ngx-translate/core';
import {ValeursService} from '../../../../services/valeurs/valeurs.service';
import {of} from 'rxjs';
import {VALEURS} from '../../../../services/jdd/jdd-valeurs.dataset';
import {COURS_CROISSANT} from '../../../../services/jdd/jdd-cours.dataset';
import {PORTEFEUILLES} from '../../../../services/jdd/jdd-portefeuilles.dataset';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('SelecteurValeursComponent', () => {
  let component: SelecteurValeursComponent;
  let fixture: ComponentFixture<SelecteurValeursComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SelecteurValeursComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService},
        provideAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecteurValeursComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given #chargerValeurs renvoie des valeurs', () => {
    beforeEach(() => {
      mockValeursService.chargerValeurs.and.returnValue(of(VALEURS));
    });

    it('when un portefeuille est fournit en entrée du composant then la picklist est initialisée', () => {
      fixture.componentRef.setInput('portefeuille', PORTEFEUILLES[0]);
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
      expect(component.valeursTarget).toEqual(VALEURS)
    });
  });
});
