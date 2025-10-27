import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogCotationsTickersPortefeuilleComponent} from './dialog-cotations-tickers-portefeuille.component';
import {TranslateModule} from '@ngx-translate/core';
import {BoursoramaService} from '../../../../services/boursorama/boursorama.service';

describe('DialogCotationsTickersPortefeuille', () => {
  let component: DialogCotationsTickersPortefeuilleComponent;
  let fixture: ComponentFixture<DialogCotationsTickersPortefeuilleComponent>;

  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerCotationsTickers']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogCotationsTickersPortefeuilleComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: BoursoramaService, useValue: mockBoursoramaService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogCotationsTickersPortefeuilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
