import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InformationsValeurComponent} from './informations-valeur.component';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {DTOInformationsTickerABCBourse} from '../../../services/abc-bourse/dto-informations-ticker-abc-bourse.class';
import {of} from 'rxjs';
import {COURS_CROISSANT} from '../../../services/jdd/jdd-cours.dataset';
import {provideAnimations} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';

describe('InformationsValeurComponent', () => {
  let component: InformationsValeurComponent;
  let fixture: ComponentFixture<InformationsValeurComponent>;

  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerLien']);
  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerInformationsTicker', 'chargerLien']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InformationsValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: BoursoramaService, useValue: mockBoursoramaService},
        {provide: AbcBourseService, useValue: mockAbcBourseService},
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InformationsValeurComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given #chargerInformationsTicker renvoie les informations pour un ticker', () => {
    beforeEach(() => {
      const informationsTicker = new DTOInformationsTickerABCBourse('GLE');
      informationsTicker.ratios.variationCAC = 0;
      informationsTicker.ratios.correlationCAC = 0;
      informationsTicker.ratios.qualiteFinanciere = '';
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
