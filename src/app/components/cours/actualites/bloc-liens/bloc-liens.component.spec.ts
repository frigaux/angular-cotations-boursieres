import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BlocLiensComponent} from './bloc-liens.component';
import {AbcBourseService} from '../../../../services/abc-bourse/abc-bourse.service';
import {of} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('BlocLiensComponent', () => {
  let component: BlocLiensComponent;
  let fixture: ComponentFixture<BlocLiensComponent>;

  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerLien']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BlocLiensComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: AbcBourseService, useValue: mockAbcBourseService},
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BlocLiensComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined()
  });

  describe('Given #chargerLien renvoie du html', () => {
    beforeEach(() => {
      mockAbcBourseService.chargerLien.and.returnValue(of('html'));
    });

    it('when #chargerLien then le html est affiché', () => {
      fixture.componentRef.setInput('configuration', {
        liens: [{moment: '28/08', objet: 'SAFRAN', titre: '', pathname: ''}],
        keysTranslation: {
          legende: 'COMPOSANTS.COURS.ACTUALITES.CHRONIQUES.CHRONIQUES',
          moment: 'COMPOSANTS.COURS.ACTUALITES.CHRONIQUES.HEURE',
          titre: 'COMPOSANTS.COURS.ACTUALITES.CHRONIQUES.TITRE'
        }
      });
      fixture.detectChanges();
      expect(component.liensDecores).toHaveSize(1);
      const lienDecore = component.liensDecores![0];

      component.chargerLien(lienDecore);
      fixture.detectChanges();
      expect(lienDecore.html).toEqual('html');
    });
  })
});
