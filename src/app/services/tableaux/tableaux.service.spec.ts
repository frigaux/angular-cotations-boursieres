import {TestBed} from '@angular/core/testing';

import {TableauxService} from './tableaux.service';
import {TranslateModule} from '@ngx-translate/core';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {
  COLONNE_ALERTES_20,
  COLONNE_CLOTURE_20,
  COLONNE_COURS_20,
  COLONNE_DATE_20,
  COLONNE_LIBELLE_40,
  COLONNE_LIBELLE_50,
  COLONNE_MARCHE_20,
  COLONNE_MOYENNE_MOBILE_20,
  COLONNE_OUVERTURE_20,
  COLONNE_PLUS_BAS_20,
  COLONNE_PLUS_HAUT_20,
  COLONNE_TICKER_20,
  COLONNE_VARIATION_20,
  COLONNE_VOLUME_20,
  TABLEAUX
} from '../jdd/jdd-tableaux.dataset';
import {COURS_PORTEFEUILLE} from '../jdd/jdd-cours.dataset';

describe('TableauxService', () => {
  let service: TableauxService;

  const cloneTABLEAUX: Function = () => JSON.parse(JSON.stringify(TABLEAUX));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [
        DatePipe,
        PercentPipe,
        CurrencyPipe,
        DecimalPipe
      ]
    });
    service = TestBed.inject(TableauxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Given des tableaux when #enregistrer then #charger renvoie les tableaux', () => {
    service.enregistrer(cloneTABLEAUX());
    expect(service.charger()).toEqual(TABLEAUX);
  });

  it('Given des tableaux when #import then #export renvoie les tableaux', () => {
    const tableaux: string = JSON.stringify(TABLEAUX);
    console.log(service.import(tableaux));
    expect(service.export()).toEqual(tableaux);
  });

  it('Given une colonne et un cours when #valeurPourUnCours sur la colonne then la fonction renvoie bien la valeur', () => {
    expect(service.valeurPourUnCours(COLONNE_DATE_20)(COURS_PORTEFEUILLE)).toBe('09/05/2025');
    expect(service.valeurPourUnCours(COLONNE_MARCHE_20)(COURS_PORTEFEUILLE)).toBe(`ENUMERATIONS.MARCHE.${COURS_PORTEFEUILLE.marche}`);
    expect(service.valeurPourUnCours(COLONNE_TICKER_20)(COURS_PORTEFEUILLE)).toBe(COURS_PORTEFEUILLE.ticker);
    expect(service.valeurPourUnCours(COLONNE_LIBELLE_40)(COURS_PORTEFEUILLE)).toBe(COURS_PORTEFEUILLE.libelle);
    expect(service.valeurPourUnCours(COLONNE_OUVERTURE_20)(COURS_PORTEFEUILLE)).toBe(`€${COURS_PORTEFEUILLE.ouverture}`);
    expect(service.valeurPourUnCours(COLONNE_PLUS_HAUT_20)(COURS_PORTEFEUILLE)).toBe(`€${COURS_PORTEFEUILLE.plusHaut}`);
    expect(service.valeurPourUnCours(COLONNE_PLUS_BAS_20)(COURS_PORTEFEUILLE)).toBe(`€${COURS_PORTEFEUILLE.plusBas}`);
    expect(service.valeurPourUnCours(COLONNE_CLOTURE_20)(COURS_PORTEFEUILLE)).toBe(`€${COURS_PORTEFEUILLE.cloture}0`);
    expect(service.valeurPourUnCours(COLONNE_VOLUME_20)(COURS_PORTEFEUILLE)).toBe('2,141,570');
    expect(service.valeurPourUnCours(COLONNE_ALERTES_20)(COURS_PORTEFEUILLE)).toEqual([]);
    expect(service.valeurPourUnCours(COLONNE_COURS_20)(COURS_PORTEFEUILLE)).toBe(`€${COURS_PORTEFEUILLE.coursAlleges[0].cloture}`);
    expect(service.valeurPourUnCours(COLONNE_MOYENNE_MOBILE_20)(COURS_PORTEFEUILLE)).toBe(`€${COURS_PORTEFEUILLE.moyennesMobiles[0]}0`);
    expect(service.valeurPourUnCours(COLONNE_VARIATION_20)(COURS_PORTEFEUILLE)).toBe('1.16%');
  });

  it('Given des tableaux invalides when #import then on récupère un message d\'erreur', () => {
    expect(service.import(JSON.stringify({portefeuille: {}})))
      .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE_REQUIS');
    expect(service.import(JSON.stringify({portefeuille: {colonnesPaysage: [COLONNE_LIBELLE_40]}})))
      .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE_TOTAL_LARGEUR');
    expect(service.import(JSON.stringify({portefeuille: {colonnesPaysage: [COLONNE_LIBELLE_40, COLONNE_LIBELLE_40, COLONNE_CLOTURE_20]}})))
      .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE_UNIQUES');
    expect(service.import(JSON.stringify({portefeuille: {colonnesPaysage: [COLONNE_LIBELLE_40, COLONNE_ALERTES_20, COLONNE_CLOTURE_20, COLONNE_VARIATION_20]}})))
      .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT_REQUIS');
    expect(service.import(JSON.stringify({portefeuille: {colonnesPaysage: [COLONNE_LIBELLE_40, COLONNE_ALERTES_20, COLONNE_CLOTURE_20, COLONNE_VARIATION_20], colonnesPortrait: [COLONNE_LIBELLE_50]}})))
      .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT_TOTAL_LARGEUR');
    expect(service.import(JSON.stringify({portefeuille: {colonnesPaysage: [COLONNE_LIBELLE_40, COLONNE_ALERTES_20, COLONNE_CLOTURE_20, COLONNE_VARIATION_20], colonnesPortrait: [COLONNE_LIBELLE_50, COLONNE_LIBELLE_50]}})))
      .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT_UNIQUES');
  });
});
