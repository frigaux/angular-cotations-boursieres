import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogCotationsValeursPortefeuilleComponent} from './dialog-cotations-valeurs-portefeuille.component';
import {TranslateModule} from '@ngx-translate/core';
import {BoursoramaService} from '../../../../services/boursorama/boursorama.service';

describe('DialogCotationsTickersPortefeuille', () => {
  let component: DialogCotationsValeursPortefeuilleComponent;
  let fixture: ComponentFixture<DialogCotationsValeursPortefeuilleComponent>;

  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerCotationsTickers']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogCotationsValeursPortefeuilleComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: BoursoramaService, useValue: mockBoursoramaService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogCotationsValeursPortefeuilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
