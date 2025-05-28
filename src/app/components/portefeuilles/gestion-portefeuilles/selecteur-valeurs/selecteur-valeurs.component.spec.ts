import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecteurValeursComponent } from './selecteur-valeurs.component';
import {TranslateModule} from '@ngx-translate/core';
import {ValeursService} from '../../../../services/valeurs/valeurs.service';
import {of} from 'rxjs';
import {VALEURS} from '../../../../services/jdd/jdd-valeur.dataset';

describe('SelecteurValeursComponent', () => {
  let component: SelecteurValeursComponent;
  let fixture: ComponentFixture<SelecteurValeursComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SelecteurValeursComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecteurValeursComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given #chargerValeurs renvoie des valeurs', () => {
    beforeEach(() => {
      mockValeursService.chargerValeurs.and.returnValue(of(VALEURS));
    });

    it('when #ngOnInit then component is loaded', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
    });
  });
});
