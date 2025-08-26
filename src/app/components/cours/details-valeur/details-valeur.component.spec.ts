import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsValeurComponent} from './details-valeur.component';
import {COURS_CROISSANT} from '../../../services/jdd/jdd-cours.dataset';
import {TranslateModule} from '@ngx-translate/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';

describe('DetailsValeurComponent', () => {
  let component: DetailsValeurComponent;
  let fixture: ComponentFixture<DetailsValeurComponent>;

  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerInformationsTicker']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetailsValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: AbcBourseService, useValue: mockAbcBourseService},
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

  it('Given un cours when le composant est rendu then le <p-panel> et <p-chart> sont rendus', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('cours', COURS_CROISSANT);
    fixture.detectChanges();
    const elPanel = element.querySelector('p-panel');
    expect(elPanel).toBeTruthy();
    const elChart = element.querySelector('p-chart');
    expect(elChart).toBeTruthy();
  });

  it('Given un cours when #informationsDetaillees est true then les informations détaillées sont affichées', () => {
    fixture.componentRef.setInput('cours', COURS_CROISSANT);
  });
});
