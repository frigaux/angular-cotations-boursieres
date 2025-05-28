import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsValeurComponent} from './details-valeur.component';
import {TranslateModule} from '@ngx-translate/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {COURS_CROISSANT, COURS_DECROISSANT} from '../../../../services/jdd/jdd-cours.dataset';

describe('DetailsValeurComponent', () => {
  let component: DetailsValeurComponent;
  let fixture: ComponentFixture<DetailsValeurComponent>;

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
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('Given un cours croissant when la timeline est construite then le composant <p-timeline> est rendue croissante', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('cours', COURS_CROISSANT);
    fixture.detectChanges();
    const el = element.querySelector('p-timeline');
    expect(el).toBeTruthy();
    expect(component.timelineItems[1].libelle).toBe('COMPOSANTS.VALEURS.VALEUR.DETAILS_VALEUR.OUVERTURE');
  });

  it('Given un cours décroissant when la timeline est construite then le composant <p-timeline> est rendue décroissante', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('cours', COURS_DECROISSANT);
    fixture.detectChanges();
    const el = element.querySelector('p-timeline');
    expect(el).toBeTruthy();
    expect(component.timelineItems[1].libelle).toBe('COMPOSANTS.VALEURS.VALEUR.DETAILS_VALEUR.CLOTURE');
  });
});
