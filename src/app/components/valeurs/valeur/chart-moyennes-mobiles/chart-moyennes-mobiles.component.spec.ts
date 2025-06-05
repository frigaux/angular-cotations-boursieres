import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartMoyennesMobilesComponent } from './chart-moyennes-mobiles.component';
import {TranslateModule} from '@ngx-translate/core';
import {COURS_CROISSANT} from '../../../../services/jdd/jdd-cours.dataset';

describe('ChartMoyennesMobilesComponent', () => {
  let component: ChartMoyennesMobilesComponent;
  let fixture: ComponentFixture<ChartMoyennesMobilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChartMoyennesMobilesComponent,
        TranslateModule.forRoot({})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartMoyennesMobilesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('Given un cours when le composant est rendu then le <p-chart> est rendu', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('cours', COURS_CROISSANT);
    fixture.detectChanges();
    const elChart = element.querySelector('p-chart');
    expect(elChart).toBeTruthy();
  });
});
