import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogActualiteValeurComponent} from './dialog-actualite-valeur.component';
import {AbcBourseService} from '../../../../services/abc-bourse/abc-bourse.service';
import {of} from 'rxjs';
import {DTOActualiteTicker} from '../../../../services/abc-bourse/dto-actualite-ticker.class';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('DialogActualiteTickerComponent', () => {
  let component: DialogActualiteValeurComponent;
  let fixture: ComponentFixture<DialogActualiteValeurComponent>;

  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerLien']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogActualiteValeurComponent],
      providers: [
        {provide: AbcBourseService, useValue: mockAbcBourseService},
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogActualiteValeurComponent);
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
