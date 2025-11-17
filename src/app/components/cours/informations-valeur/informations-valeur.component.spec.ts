import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InformationsValeurComponent} from './informations-valeur.component';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {of} from 'rxjs';
import {COURS_CROISSANT} from '../../../services/jdd/jdd-cours.dataset';
import {provideAnimations} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';
import {ZoneBourseService} from '../../../services/zone-bourse/zone-bourse.service';
import {DTO_INFORMATIONS_TICKER_ABCBOURSE} from '../../../services/jdd/jdd-abcbourse.dataset';
import {DTO_INFORMATIONS_TICKER_BOURSORAMA} from '../../../services/jdd/jdd-boursorama.dataset';

describe('InformationsValeurComponent', () => {
  let component: InformationsValeurComponent;
  let fixture: ComponentFixture<InformationsValeurComponent>;

  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerInformationsTicker', 'chargerLien']);
  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerInformationsTicker', 'chargerLien']);
  const mockZoneBourseService = jasmine.createSpyObj('ZoneBourseService', ['chargerLien']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InformationsValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: BoursoramaService, useValue: mockBoursoramaService},
        {provide: AbcBourseService, useValue: mockAbcBourseService},
        {provide: ZoneBourseService, useValue: mockZoneBourseService},
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
      mockAbcBourseService.chargerInformationsTicker.and.returnValue(of(DTO_INFORMATIONS_TICKER_ABCBOURSE));
      mockBoursoramaService.chargerInformationsTicker.and.returnValue(of(DTO_INFORMATIONS_TICKER_BOURSORAMA));
    });

    it('when input cours then le composant est chargé', () => {
      fixture.componentRef.setInput('cours', COURS_CROISSANT);
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
    });
  })
});
