import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsValeurComponent} from './details-valeur.component';
import {TranslateModule} from '@ngx-translate/core';
import {Cours} from '../../../cours/Cours';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('DetailsValeurComponent', () => {
  let component: DetailsValeurComponent;
  let fixture: ComponentFixture<DetailsValeurComponent>;

  const coursCroissant: Cours = new Cours("GLE", "Societe Generale",
    {
      "date": new Date("2025-05-09"),
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
    }
  );

  const coursDecroissant: Cours = new Cours("GLE", "Societe Generale",
    {
      "date": new Date("2025-05-09"),
      "ouverture": 46.8,
      "plusHaut": 46.82,
      "plusBas": 46.06,
      "cloture": 46.23,
      "volume": 2141570,
      "moyennesMobiles": [
        46.8,
        46.68
      ],
      "alerte": true
    }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetailsValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DetailsValeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('Given un cours croissant when la timeline est construite then le composant <p-timeline> est rendue croissante', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('cours', coursCroissant);
    fixture.detectChanges();
    const el = element.querySelector('p-timeline');
    expect(el).toBeTruthy();
    expect(component.timelineItems[1].libelle).toBe('COMPOSANTS.VALEURS.VALEUR.DETAILS_VALEUR.OUVERTURE');
  });

  it('Given un cours décroissant when la timeline est construite then le composant <p-timeline> est rendue décroissante', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('cours', coursDecroissant);
    fixture.detectChanges();
    const el = element.querySelector('p-timeline');
    expect(el).toBeTruthy();
    expect(component.timelineItems[1].libelle).toBe('COMPOSANTS.VALEURS.VALEUR.DETAILS_VALEUR.CLOTURE');
  });
});
