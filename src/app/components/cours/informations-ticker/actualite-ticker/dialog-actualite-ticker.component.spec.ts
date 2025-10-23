import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogActualiteTickerComponent} from './dialog-actualite-ticker.component';
import {AbcBourseService} from '../../../../services/abc-bourse/abc-bourse.service';
import {of} from 'rxjs';
import {DTOActualiteTicker} from '../../../../services/abc-bourse/dto-actualite-ticker.class';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('DialogActualiteTickerComponent', () => {
  let component: DialogActualiteTickerComponent;
  let fixture: ComponentFixture<DialogActualiteTickerComponent>;

  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerLien']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogActualiteTickerComponent],
      providers: [
        {provide: AbcBourseService, useValue: mockAbcBourseService},
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogActualiteTickerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Given #chargerLien renvoie une actualité', () => {
    beforeEach(() => {
      mockAbcBourseService.chargerLien.and.returnValue(of(''));
    });

    it('when #reinitialiserVue then le composant est chargé', () => {
      fixture.componentRef.setInput('actualite', new DTOActualiteTicker('', '', ''));
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.visible).toBeTrue();
    });
  });
});
