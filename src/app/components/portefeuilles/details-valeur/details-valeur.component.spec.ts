import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsValeurComponent} from './details-valeur.component';
import {COURS_PORTEFEUILLE} from '../../../services/jdd/jdd-cours.dataset';
import {TranslateModule} from '@ngx-translate/core';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('CoursComponent', () => {
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Given un cours when le composant est rendu then le <p-chart> est rendu', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('cours', COURS_PORTEFEUILLE);
    fixture.detectChanges();
    const elChart = element.querySelector('p-chart');
    expect(elChart).toBeTruthy();
  });
});
