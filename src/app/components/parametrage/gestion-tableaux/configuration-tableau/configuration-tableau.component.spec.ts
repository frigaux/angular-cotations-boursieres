import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfigurationTableauComponent} from './configuration-tableau.component';
import {TranslateModule} from '@ngx-translate/core';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {TABLEAUX} from '../../../../services/jdd/jdd-tableaux.dataset';
import {TypesColonnes} from '../../../../services/tableaux/types-colonnes.enum.ts.ts';
import {DTOColonne} from '../../../../services/tableaux/dto-colonne-portefeuille.interface';
import {TypesColonnesPortefeuille} from '../../../../services/tableaux/types-colonnes-portefeuille.enum';
import {TypesColonnesCours} from '../../../../services/tableaux/types-colonnes-cours.enum';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('ConfigurationTableauComponent', () => {
  let component: ConfigurationTableauComponent;
  let fixture: ComponentFixture<ConfigurationTableauComponent>;

  const cloneTABLEAUX: Function = () => JSON.parse(JSON.stringify(TABLEAUX));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfigurationTableauComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        DatePipe,
        PercentPipe,
        CurrencyPipe,
        DecimalPipe,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConfigurationTableauComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given des colonnes et typeColonnes en inputs', () => {
    let colonnes: DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>[];
    beforeEach(() => {
      colonnes = cloneTABLEAUX().portefeuille.colonnesPaysage;
      fixture.componentRef.setInput('configuration', {
        colonnes,
        type: TypesColonnes.PORTEFEUILLE
      });
    });

    it('when #ngOnInit then les tableaux sont affichés', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component.colonnesDecorees).toHaveSize(colonnes.length)
    });

    it('when #ajouterColonne then une nouvelle colonne est crée', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.ajouterColonne();
      expect(component.colonnesDecorees).toHaveSize(TABLEAUX.portefeuille.colonnesPaysage.length + 1)
    });

    it('when #supprimerColonne then une colonne est supprimée', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.supprimerColonne(colonnes[0]);
      expect(component.colonnesDecorees).toHaveSize(TABLEAUX.portefeuille.colonnesPaysage.length - 1)
    });
  });
});
