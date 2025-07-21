import {Injectable} from '@angular/core';
import {DTOTableaux} from './dto-tableaux.interface';
import {TranslateService} from '@ngx-translate/core';
import {DTOTableau} from './dto-tableau-portefeuille.interface';
import {DTOColonne} from './dto-colonne-portefeuille.interface';
import {TypesColonnesPortefeuille} from './types-colonnes-portefeuille.enum';
import {CoursPortefeuille} from '../../components/portefeuilles/cours-portefeuille.class';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {TypesColonnesCours} from './types-colonnes-cours.enum';

@Injectable({
  providedIn: 'root'
})
export class TableauxService {
  private static readonly TABLEAUX: string = 'tableaux';
  private cleMessageErreur?: string;

  private static readonly CONFIGURATION_INITIALE: DTOTableaux = {
    portefeuille: {
      colonnesPaysage: [],
      colonnesPortrait: []
    }
  };

  constructor(private translateService: TranslateService,
              private datePipe: DatePipe,
              private percentPipe: PercentPipe,
              private currencyPipe: CurrencyPipe,
              private decimalPipe: DecimalPipe) {
  }


  public charger(): DTOTableaux {
    const json = window.localStorage.getItem(TableauxService.TABLEAUX);
    if (json) {
      try {
        const tableaux: any = JSON.parse(json);
        if (this.validerTableaux(tableaux)) {
          return tableaux;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return TableauxService.CONFIGURATION_INITIALE;
  }

  public enregistrer(tableaux: DTOTableaux): string | undefined {
    if (this.validerTableaux(tableaux)) {
      window.localStorage.setItem(TableauxService.TABLEAUX, JSON.stringify(tableaux));
      return undefined;
    } else {
      return this.translateService.instant(this.cleMessageErreur!);
    }
  }

  public export(): string {
    const json = window.localStorage.getItem(TableauxService.TABLEAUX);
    if (json) {
      try {
        const tableaux: any = JSON.parse(json);
        if (this.validerTableaux(tableaux)) {
          return json;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return JSON.stringify(TableauxService.CONFIGURATION_INITIALE);
  }

  public import(json: string): string | undefined {
    try {
      const tableaux: any = JSON.parse(json);
      if (this.validerTableaux(tableaux)) {
        window.localStorage.setItem(TableauxService.TABLEAUX, json);
        return undefined;
      } else {
        return this.translateService.instant(this.cleMessageErreur!);
      }
    } catch (e) { // JSON mal formé
      return (e as SyntaxError).message;
    }
  }

  public typeAvecParametre<T extends TypesColonnesPortefeuille | TypesColonnesCours>(type: T) {
    return type === TypesColonnesPortefeuille.COURS
      || type === TypesColonnesPortefeuille.MOYENNE_MOBILE
      || type === TypesColonnesPortefeuille.VARIATION;
  }

  public valeurPourUnCours<T extends TypesColonnesPortefeuille | TypesColonnesCours>(colonne: DTOColonne<T>): Function {
    switch (colonne.type) {
      case TypesColonnesPortefeuille.DATE:
        return (cours: CoursPortefeuille) => this.datePipe.transform(cours.date, 'dd/MM/yyyy');
      case TypesColonnesPortefeuille.MARCHE:
        return (cours: CoursPortefeuille) => this.translateService.instant(`ENUMERATIONS.MARCHE.${cours.marche}`);
      case TypesColonnesPortefeuille.TICKER:
        return (cours: CoursPortefeuille) => cours.ticker;
      case TypesColonnesPortefeuille.LIBELLE:
        return (cours: CoursPortefeuille) => cours.libelle;
      case TypesColonnesPortefeuille.OUVERTURE:
        return (cours: CoursPortefeuille) => this.currencyPipe.transform(cours.ouverture, '€');
      case TypesColonnesPortefeuille.PLUS_HAUT:
        return (cours: CoursPortefeuille) => this.currencyPipe.transform(cours.plusHaut, '€');
      case TypesColonnesPortefeuille.PLUS_BAS:
        return (cours: CoursPortefeuille) => this.currencyPipe.transform(cours.plusBas, '€');
      case TypesColonnesPortefeuille.CLOTURE:
        return (cours: CoursPortefeuille) => this.currencyPipe.transform(cours.cloture, '€');
      case TypesColonnesPortefeuille.VOLUME:
        return (cours: CoursPortefeuille) => this.decimalPipe.transform(cours.volume);
      case TypesColonnesPortefeuille.ALERTES:
        return (cours: CoursPortefeuille) => cours.alertes;
      case TypesColonnesPortefeuille.COURS:
        return (cours: CoursPortefeuille) => this.currencyPipe.transform(cours.coursAlleges[colonne.parametre! - 1].cloture, '€');
      case TypesColonnesPortefeuille.MOYENNE_MOBILE:
        return (cours: CoursPortefeuille) => this.currencyPipe.transform(cours.moyennesMobiles[colonne.parametre! - 1], '€');
      case TypesColonnesPortefeuille.VARIATION:
        return (cours: CoursPortefeuille) => this.percentPipe.transform(cours.calculerVariation2(colonne.parametre!), '1.2-2');
      default:
        throw new Error(`Colonne non gérée ${colonne.type}`);
    }
  }

  // TODO : unicité nom colonne + largeur number + paramètre number requis + paramètre > 0
  private validerTableaux(tableaux: DTOTableaux): boolean {
    this.cleMessageErreur = undefined;
    if (tableaux.portefeuille) {
      const portefeuille: DTOTableau<any> = tableaux.portefeuille;
      if (!(portefeuille.colonnesPaysage instanceof Array)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE.REQUIS';
        return false;
      }
      if (!this.uniciteNom(portefeuille.colonnesPaysage)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE.NOM_DOUBLON';
        return false;
      }
      if (!this.validerLargeurs(portefeuille.colonnesPaysage)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE.LARGEUR_INVALIDE';
        return false;
      }
      if (!this.validerParametres(portefeuille.colonnesPaysage)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE.PARAMETRE_INVALIDE';
        return false;
      }
      if (!this.validerLargeurTotale(portefeuille.colonnesPaysage)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE.TOTAL_LARGEUR';
        return false;
      }
      if (!this.uniciteTypeColonnes(portefeuille.colonnesPaysage)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE.UNICITE_TYPE';
        return false;
      }
      if (!(portefeuille.colonnesPortrait instanceof Array)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT.REQUIS';
        return false;
      }
      if (!this.uniciteNom(portefeuille.colonnesPortrait)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT.NOM_DOUBLON';
        return false;
      }
      if (!this.validerLargeurs(portefeuille.colonnesPortrait)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT.LARGEUR_INVALIDE';
        return false;
      }
      if (!this.validerParametres(portefeuille.colonnesPortrait)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT.PARAMETRE_INVALIDE';
        return false;
      }
      if (!this.validerLargeurTotale(portefeuille.colonnesPortrait)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT.TOTAL_LARGEUR';
        return false;
      }
      if (!this.uniciteTypeColonnes(portefeuille.colonnesPortrait)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT.UNICITE_TYPE';
        return false;
      }
    }
    return true;
  }

  private validerLargeurTotale<T extends TypesColonnesPortefeuille | TypesColonnesCours>(colonnes: DTOColonne<T>[]) {
    return 100 === colonnes.reduce((accumulator, colonne) => accumulator + colonne.largeur, 0);
  }

  private uniciteTypeColonnes<T extends TypesColonnesPortefeuille | TypesColonnesCours>(colonnes: DTOColonne<T>[]) {
    const types: Set<TypesColonnesPortefeuille | TypesColonnesCours> = new Set();
    for (const colonne of colonnes) {
      if (!this.typeAvecParametre(colonne.type)) {
        if (types.has(colonne.type)) {
          return false;
        } else {
          types.add(colonne.type);
        }
      }
    }
    return true;
  }

  private uniciteNom<T extends TypesColonnesPortefeuille | TypesColonnesCours>(colonnes: DTOColonne<T>[]) {
    const noms: Set<string> = new Set();
    for (const colonne of colonnes) {
      if (noms.has(colonne.nom.toLowerCase())) {
        return false;
      } else {
        noms.add(colonne.nom.toLowerCase());
      }
    }
    return true;
  }

  private validerLargeurs<T extends TypesColonnesPortefeuille | TypesColonnesCours>(colonnes: DTOColonne<T>[]): boolean {
    return colonnes.find(colonne =>
      isNaN(colonne.largeur) || colonne.largeur < 1
    ) === undefined;
  }

  private validerParametres<T extends TypesColonnesPortefeuille | TypesColonnesCours>(colonnes: DTOColonne<T>[]): boolean {
    return colonnes.find(colonne =>
      this.typeAvecParametre(colonne.type) && (colonne.parametre === undefined || isNaN(colonne.parametre) || colonne.parametre < 1)
    ) === undefined;
  }
}
