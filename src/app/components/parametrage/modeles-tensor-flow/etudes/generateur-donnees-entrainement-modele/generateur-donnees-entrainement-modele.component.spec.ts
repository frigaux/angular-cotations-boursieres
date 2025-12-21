import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GenerateurDonneesEntrainementModeleComponent} from './generateur-donnees-entrainement-modele.component';
import {TranslateModule} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {CoursService} from '../../../../../services/cours/cours.service';
import {ValeursService} from '../../../../../services/valeurs/valeurs.service';
import {of} from 'rxjs';
import {VALEURS} from '../../../../../services/jdd/jdd-valeurs.dataset';
import {LISTE_COURS_AVEC_LISTE_ALLEGEE} from '../../../../../services/jdd/jdd-cours.dataset';

describe('GenerateurDonneesEntrainementModeleComponent', () => {
  let component: GenerateurDonneesEntrainementModeleComponent;
  let fixture: ComponentFixture<GenerateurDonneesEntrainementModeleComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickersWithLimit']);

  const cloneCOURS: Function = () => JSON.parse(JSON.stringify(LISTE_COURS_AVEC_LISTE_ALLEGEE));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GenerateurDonneesEntrainementModeleComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService},
        {provide: CoursService, useValue: mockCoursService},
        DatePipe
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GenerateurDonneesEntrainementModeleComponent);
    component = fixture.componentInstance;

    mockValeursService.chargerValeurs.and.returnValue(of(VALEURS));
    mockCoursService.chargerCoursTickersWithLimit.and.returnValue(of(cloneCOURS));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
