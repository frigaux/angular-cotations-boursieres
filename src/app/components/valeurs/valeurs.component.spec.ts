import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValeursComponent } from './valeurs.component';
import { ValeursService } from '../../services/valeurs.service';
import { DTOValeur } from '../../services/DTOValeur';
import { Observable } from 'rxjs';

describe('ValeursComponent', () => {
  let component: ValeursComponent;
  let fixture: ComponentFixture<ValeursComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['getValeurs']);

  const valeurs: DTOValeur[] = [{
    "ticker": "GLE",
    "marche": "EURO_LIST_A",
    "libelle": "Societe Generale"
  },
  {
    "ticker": "BNP",
    "marche": "EURO_LIST_A",
    "libelle": "Bnp Paribas"
  }];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ValeursComponent],
      providers: [
        { provide: ValeursService, useValue: mockValeursService }
      ]
    });

    fixture = TestBed.createComponent(ValeursComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have <div>', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    const el = bannerElement.querySelector('div');
    expect(el).toBeTruthy();
  });

  describe('Given #getValeurs renvoie des valeurs', () => {
    beforeEach(() => {
      mockValeursService.getValeurs.and.returnValue(new Observable(observer => {
        observer.next(valeurs);
      }));
    });

    it('when #ngOnInit then ', () => {
      component.ngOnInit();
      fixture.detectChanges(); // pour essayer de s'assurer que le error sur l'observable a bien été traité
      expect(component).toBeDefined();
    });
  });
});
