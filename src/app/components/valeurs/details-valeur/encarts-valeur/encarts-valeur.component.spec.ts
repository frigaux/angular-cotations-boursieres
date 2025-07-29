import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EncartsValeurComponent} from './encarts-valeur.component';
import {TranslateModule} from '@ngx-translate/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {COURS_CROISSANT, COURS_DECROISSANT} from '../../../../services/jdd/jdd-cours.dataset';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {ConfirmationService} from 'primeng/api';

describe('EncartsValeurComponent', () => {
  let component: EncartsValeurComponent;
  let fixture: ComponentFixture<EncartsValeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EncartsValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        provideAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        DatePipe
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EncartsValeurComponent);
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
    expect(component.timelineItems[1].libelle).toBe('COMPOSANTS.VALEURS.DETAILS_VALEUR.ENCARTS_VALEUR.OUVERTURE');
  });

  it('Given un cours décroissant when la timeline est construite then le composant <p-timeline> est rendue décroissante', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('cours', COURS_DECROISSANT);
    fixture.detectChanges();
    const el = element.querySelector('p-timeline');
    expect(el).toBeTruthy();
    expect(component.timelineItems[1].libelle).toBe('COMPOSANTS.VALEURS.DETAILS_VALEUR.ENCARTS_VALEUR.CLOTURE');
  });
});
