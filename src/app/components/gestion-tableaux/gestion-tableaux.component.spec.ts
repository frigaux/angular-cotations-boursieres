import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GestionTableauxComponent} from './gestion-tableaux.component';
import {TranslateModule} from '@ngx-translate/core';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {TABLEAUX} from '../../services/jdd/jdd-tableaux.dataset';

describe('GestionTableauxComponent', () => {
  let component: GestionTableauxComponent;
  let fixture: ComponentFixture<GestionTableauxComponent>;

  const cloneTABLEAUX: Function = () => JSON.parse(JSON.stringify(TABLEAUX));

  const mockTableauxService = jasmine.createSpyObj('TableauxService', ['charger']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GestionTableauxComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        DatePipe,
        PercentPipe,
        CurrencyPipe,
        DecimalPipe
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GestionTableauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given un LocalStorage avec des tableaux existants', () => {
    beforeEach(() => {
      mockTableauxService.charger.and.returnValue(cloneTABLEAUX());
    });

    it('when #ngOnInit then les tableaux sont chargés', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.tableaux).toEqual(TABLEAUX);
    });
  });
});
