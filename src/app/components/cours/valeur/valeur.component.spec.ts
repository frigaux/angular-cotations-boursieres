import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ValeurComponent} from './valeur.component';
import {COURS_CROISSANT} from '../../../services/jdd/JDDCours';
import {TranslateModule} from '@ngx-translate/core';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('ValeurComponent', () => {
  let component: ValeurComponent;
  let fixture: ComponentFixture<ValeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ValeurComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('Given un cours when le composant est rendu then le <p-panel> et <p-chart> sont rendus', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('cours', COURS_CROISSANT);
    fixture.detectChanges();
    const elPanel = element.querySelector('p-panel');
    expect(elPanel).toBeTruthy();
    const elChart = element.querySelector('p-chart');
    expect(elChart).toBeTruthy();
  });
});
