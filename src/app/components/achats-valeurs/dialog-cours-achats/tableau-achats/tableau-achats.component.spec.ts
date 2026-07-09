import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauAchatsComponent} from './tableau-achats.component';
import {TranslateModule} from '@ngx-translate/core';

describe('TableauAchatsComponent', () => {
  let component: TableauAchatsComponent;
  let fixture: ComponentFixture<TableauAchatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableauAchatsComponent,
        TranslateModule.forRoot({})
      ],
      providers: []
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableauAchatsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
    fixture.componentRef.setInput('achats', {
      "achats": [
        {
          "valeur": {
            "ticker": "BNP",
            "marche": "EURO_LIST_A",
            "libelle": "Bnp Paribas"
          },
          "achatDecore": {
            "id": 0,
            "form": {
              "etape": 0
            },
            "achat": {
              "quantite": 10,
              "prix": 75.28
            },
            "cours": 76.36,
            "dto": {
              "ticker": "BNP",
              "ouverture": 76.64,
              "plusHaut": 76.83,
              "plusBas": 76.06,
              "cloture": 76.36,
              "volume": 1620728,
              "moyennesMobiles": [
                76.26,
                76.36
              ]
            },
            "variation": -0.014143530644316393
          },
          "dividendes": [
            {
              "date": "2025-05-19",
              "ticker": "BNP",
              "type": "détachement",
              "montant": 4.79,
              "pourcentageRendement": 0.0548
            },
            {
              "date": "2025-09-26",
              "ticker": "BNP",
              "type": "détachement (acompte)",
              "montant": 2.59,
              "pourcentageRendement": 0.0296
            }
          ]
        }
      ],
      "etape": 0
    });
    fixture.detectChanges();
  });
});
