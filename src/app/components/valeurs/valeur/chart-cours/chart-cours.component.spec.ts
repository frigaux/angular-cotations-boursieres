import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartCoursComponent} from './chart-cours.component';
import {TranslateModule} from '@ngx-translate/core';
import {COURS_CROISSANT} from '../../../../services/jdd/jdd-cours.dataset';

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
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('Given des cours when le composant est rendu then le <p-chart> est rendu', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('cours', COURS_CROISSANT);
    fixture.detectChanges();
    const elChart = element.querySelector('p-chart');
    expect(elChart).toBeTruthy();
  });
});
