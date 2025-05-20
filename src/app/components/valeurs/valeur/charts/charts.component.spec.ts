import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartsComponent} from './charts.component';
import {TranslateModule} from '@ngx-translate/core';
import {COURS_CROISSANT, LISTE_COURS_TICKER_LIGHT} from '../../../../services/jdd/JDDCours';

describe('ChartsComponent', () => {
  let component: ChartsComponent;
  let fixture: ComponentFixture<ChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChartsComponent,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('Given des cours when le composant est rendu then le <p-chart> sont rendus', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('cours', COURS_CROISSANT);
    fixture.componentRef.setInput('coursLight', LISTE_COURS_TICKER_LIGHT);
    fixture.detectChanges();
    const elChart = element.querySelector('p-chart');
    expect(elChart).toBeTruthy();
  });
});
