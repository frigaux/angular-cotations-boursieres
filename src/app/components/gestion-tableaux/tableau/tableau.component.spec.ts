import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauComponent} from './tableau.component';
import {TranslateModule} from '@ngx-translate/core';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {TABLEAUX} from '../../../services/jdd/jdd-tableaux.dataset';
import {TypesColonnes} from '../../../services/tableaux/types-colonnes.enum.ts';

describe('TableauComponent', () => {
  let component: TableauComponent;
  let fixture: ComponentFixture<TableauComponent>;

  const cloneTABLEAUX: Function = () => JSON.parse(JSON.stringify(TABLEAUX));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableauComponent,
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

    fixture = TestBed.createComponent(TableauComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given des colonnes et typeColonnes en inputs', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('configuration', {
        colonnes: cloneTABLEAUX().portefeuille.colonnesPaysage,
        type: TypesColonnes.PORTEFEUILLE
      });
    });

    it('when #ngOnInit then les tableaux sont affichés', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component.colonnesDecorees).toHaveSize(TABLEAUX.portefeuille.colonnesPaysage.length)
    });

    it('when #ajouterColonne then une nouvelle colonne est crée', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.ajouterColonne();
      expect(component.colonnesDecorees).toHaveSize(TABLEAUX.portefeuille.colonnesPaysage.length + 1)
    });

    it('when #supprimerColonne then une colonne est supprimée', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.supprimerColonne(component.colonnesDecorees[0].colonne);
      expect(component.colonnesDecorees).toHaveSize(TABLEAUX.portefeuille.colonnesPaysage.length - 1)
    });
  });
});
