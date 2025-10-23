import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InformationsTickerComponent} from './informations-ticker.component';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {DTOInformationsTickerABCBourse} from '../../../services/abc-bourse/dto-informations-ticker-abc-bourse.class';
import {of} from 'rxjs';
import {COURS_CROISSANT} from '../../../services/jdd/jdd-cours.dataset';
import {provideAnimations} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';

describe('InformationsTickerComponent', () => {
  let component: InformationsTickerComponent;
  let fixture: ComponentFixture<InformationsTickerComponent>;

  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerInformationsTicker']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InformationsTickerComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: AbcBourseService, useValue: mockAbcBourseService},
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InformationsTickerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given #chargerInformationsTicker renvoie les informations pour un ticker', () => {
    beforeEach(() => {
      const informationsTicker = new DTOInformationsTickerABCBourse('GLE');
      informationsTicker.variationCAC = 0;
      informationsTicker.correlationCAC = 0;
      informationsTicker.qualiteFinanciere = '';
      mockAbcBourseService.chargerInformationsTicker.and.returnValue(of(informationsTicker));
    });

    it('when input cours then le composant est chargé', () => {
      fixture.componentRef.setInput('cours', COURS_CROISSANT);
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
    });
  })
});
