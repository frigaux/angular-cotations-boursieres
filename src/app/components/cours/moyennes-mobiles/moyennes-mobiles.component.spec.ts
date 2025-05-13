import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MoyennesMobilesComponent} from './moyennes-mobiles.component';
import {TranslateModule} from '@ngx-translate/core';
import {DTOListeCours} from '../../../services/cours/DTOListeCours';
import {DTOCours} from '../../../services/cours/DTOCours';
import {ValeursService} from '../../../services/valeurs/valeurs.service';
import {CoursService} from '../../../services/cours/cours.service';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('MoyennesMobilesComponent', () => {
  let component: MoyennesMobilesComponent;
  let fixture: ComponentFixture<MoyennesMobilesComponent>;

  const cours: DTOCours = {
    "ticker": "GLE",
    "ouverture": 46.23,
    "plusHaut": 46.82,
    "plusBas": 46.06,
    "cloture": 46.8,
    "volume": 2141570,
    "moyennesMobiles": [
      46.8,
      46.68
    ],
    "alerte": true
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        MoyennesMobilesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        provideAnimations()
      ]
    });

    fixture = TestBed.createComponent(MoyennesMobilesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('when l\'input cours est définie then le composant <p-panel> est rendu', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('cours', cours);
    fixture.detectChanges();
    const el = element.querySelector('p-panel');
    expect(el).toBeTruthy();
  });
});
