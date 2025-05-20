import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartCoursComponent} from './chart-cours.component';
import {TranslateModule} from '@ngx-translate/core';
import {COURS_CROISSANT, LISTE_COURS_TICKER_LIGHT} from '../../../../services/jdd/JDDCours';

describe('ChartCoursComponent', () => {
  let component: ChartCoursComponent;
  let fixture: ComponentFixture<ChartCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChartCoursComponent,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChartCoursComponent);
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
