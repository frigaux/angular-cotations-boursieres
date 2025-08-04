import {TestBed} from '@angular/core/testing';

import {TableauxService} from './tableaux.service';
import {TranslateModule} from '@ngx-translate/core';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {
  COLONNE_ALERTES_20,
  COLONNE_ALERTES_30,
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
import {TypesColonnesPortefeuille} from './types-colonnes-portefeuille.enum';
import {DTOColonne} from './dto-colonne-portefeuille.interface';
import {DTOTableaux} from './dto-tableaux.interface';

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
    expect(service.enregistrer(cloneTABLEAUX())).toBeUndefined();
    expect(service.charger()).toEqual(TABLEAUX);
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


  describe('Given #onImport', () => {
    let resultatImport: DTOTableaux | undefined;
    const tableaux: string = JSON.stringify(TABLEAUX);

    beforeEach(() => {
      resultatImport = undefined;
      service.onImport(tableaux => resultatImport = tableaux);
    });

    it('when #import du format non JSON then on récupère un message d\'erreur', () => {
      expect(service.import("+ nimp (")).toBeDefined();
      expect(resultatImport).toEqual(undefined);
    });

    it('when #import des tableaux invalides then on récupère un message d\'erreur', () => {
      expect(service.import(JSON.stringify({portefeuille: {}})))
        .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE.REQUIS');

      expect(service.import(JSON.stringify({portefeuille: {colonnesPaysage: [COLONNE_LIBELLE_40, COLONNE_LIBELLE_40, COLONNE_CLOTURE_20]}})))
        .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE.NOM_DOUBLON');

      const largeurInvalidePaysage: DTOColonne<TypesColonnesPortefeuille> = JSON.parse(JSON.stringify(COLONNE_LIBELLE_40));
      largeurInvalidePaysage.largeur = 0;
      expect(service.import(JSON.stringify({portefeuille: {colonnesPaysage: [largeurInvalidePaysage, COLONNE_ALERTES_20, COLONNE_CLOTURE_20, COLONNE_VARIATION_20]}})))
        .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE.LARGEUR_INVALIDE');

      const parametreInvalidePaysage: DTOColonne<TypesColonnesPortefeuille> = JSON.parse(JSON.stringify(COLONNE_VARIATION_20));
      parametreInvalidePaysage.parametre = undefined;
      expect(service.import(JSON.stringify({portefeuille: {colonnesPaysage: [COLONNE_LIBELLE_40, COLONNE_ALERTES_20, COLONNE_CLOTURE_20, parametreInvalidePaysage]}})))
        .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE.PARAMETRE_INVALIDE');

      expect(service.import(JSON.stringify({portefeuille: {colonnesPaysage: [COLONNE_LIBELLE_40]}})))
        .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE.TOTAL_LARGEUR');

      const typeDoublonPaysage: DTOColonne<TypesColonnesPortefeuille> = JSON.parse(JSON.stringify(COLONNE_LIBELLE_40));
      typeDoublonPaysage.nom = 'Libellé2';
      expect(service.import(JSON.stringify({portefeuille: {colonnesPaysage: [COLONNE_LIBELLE_40, typeDoublonPaysage, COLONNE_CLOTURE_20]}})))
        .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE.UNICITE_TYPE');


      expect(service.import(JSON.stringify({portefeuille: {colonnesPaysage: [COLONNE_LIBELLE_40, COLONNE_ALERTES_20, COLONNE_CLOTURE_20, COLONNE_VARIATION_20]}})))
        .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT.REQUIS');

      expect(service.import(JSON.stringify({
        portefeuille: {
          colonnesPaysage: [COLONNE_LIBELLE_40, COLONNE_ALERTES_20, COLONNE_CLOTURE_20, COLONNE_VARIATION_20],
          colonnesPortrait: [COLONNE_LIBELLE_50, COLONNE_LIBELLE_50]
        }
      })))
        .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT.NOM_DOUBLON');

      const largeurInvalidePortrait: DTOColonne<TypesColonnesPortefeuille> = JSON.parse(JSON.stringify(COLONNE_ALERTES_30));
      largeurInvalidePortrait.largeur = 0;
      expect(service.import(JSON.stringify({
        portefeuille: {
          colonnesPaysage: [COLONNE_LIBELLE_40, COLONNE_ALERTES_20, COLONNE_CLOTURE_20, COLONNE_VARIATION_20],
          colonnesPortrait: [COLONNE_LIBELLE_50, largeurInvalidePortrait, COLONNE_VARIATION_20]
        }
      })))
        .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT.LARGEUR_INVALIDE');

      const parametreInvalidePortrait: DTOColonne<TypesColonnesPortefeuille> = JSON.parse(JSON.stringify(COLONNE_VARIATION_20));
      parametreInvalidePortrait.parametre = undefined;
      expect(service.import(JSON.stringify({
        portefeuille: {
          colonnesPaysage: [COLONNE_LIBELLE_40, COLONNE_ALERTES_20, COLONNE_CLOTURE_20, COLONNE_VARIATION_20],
          colonnesPortrait: [COLONNE_LIBELLE_50, COLONNE_ALERTES_30, parametreInvalidePortrait]
        }
      })))
        .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT.PARAMETRE_INVALIDE');

      expect(service.import(JSON.stringify({
        portefeuille: {
          colonnesPaysage: [COLONNE_LIBELLE_40, COLONNE_ALERTES_20, COLONNE_CLOTURE_20, COLONNE_VARIATION_20],
          colonnesPortrait: [COLONNE_LIBELLE_50]
        }
      })))
        .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT.TOTAL_LARGEUR');

      const typeDoublonPortrait: DTOColonne<TypesColonnesPortefeuille> = JSON.parse(JSON.stringify(COLONNE_LIBELLE_50));
      typeDoublonPortrait.nom = 'Libellé2';
      expect(service.import(JSON.stringify({
        portefeuille: {
          colonnesPaysage: [COLONNE_LIBELLE_40, COLONNE_ALERTES_20, COLONNE_CLOTURE_20, COLONNE_VARIATION_20],
          colonnesPortrait: [COLONNE_LIBELLE_50, typeDoublonPortrait]
        }
      })))
        .toBe('SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT.UNICITE_TYPE');

      expect(resultatImport).toEqual(undefined);
    });

    it('when #import des tableaux valides then #charger renvoie les tableaux', () => {
      expect(service.import(tableaux)).toBeUndefined();
      expect(resultatImport).toEqual(TABLEAUX);
      expect(service.charger()).toEqual(TABLEAUX);
    });
  });
});
