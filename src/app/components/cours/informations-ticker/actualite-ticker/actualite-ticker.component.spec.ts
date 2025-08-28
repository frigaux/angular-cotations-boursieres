import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActualiteTickerComponent} from './actualite-ticker.component';
import {AbcBourseService} from '../../../../services/abc-bourse/abc-bourse.service';
import {DTOActualites} from '../../../../services/abc-bourse/dto-actualites';
import {of} from 'rxjs';
import {DTOActualiteTicker} from '../../../../services/abc-bourse/dto-actualite-ticker.class';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('ActualiteComponent', () => {
  let component: ActualiteTickerComponent;
  let fixture: ComponentFixture<ActualiteTickerComponent>;

  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerActualiteTicker']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualiteTickerComponent],
      providers: [
        {provide: AbcBourseService, useValue: mockAbcBourseService},
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ActualiteTickerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Given #chargerActualiteTicker renvoie une actualité', () => {
    beforeEach(() => {
      mockAbcBourseService.chargerActualiteTicker.and.returnValue(of(''));
    });

    it('when #reinitialiserVue then le composant est chargé', () => {
      fixture.componentRef.setInput('actualite', new DTOActualiteTicker('', '', ''));
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.visible).toBeTrue();
    });
  });
});
