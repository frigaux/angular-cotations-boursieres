import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartsComponent} from './charts.component';
import {TranslateModule} from '@ngx-translate/core';
import {COURS_CROISSANT} from '../../../../services/jdd/jdd-cours.dataset';

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
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('Given des cours when le composant est rendu then le <p-chart> est rendu', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('cours', COURS_CROISSANT);
    fixture.detectChanges();
    component.clickPeriode();
    const elChart = element.querySelector('p-chart');
    expect(elChart).toBeTruthy();
  });
});
