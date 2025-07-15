import {Injectable} from '@angular/core';
import {DTOTableaux} from './dto-tableaux.interface';
import {TranslateService} from '@ngx-translate/core';
import {DTOTableauPortefeuille} from './dto-tableau-portefeuille.interface';
import {DTOColonnePortefeuille} from './dto-colonne-portefeuille.interface';
import {TypeColonnePortefeuille} from './type-colonne-portefeuille.enum';
import {CoursPortefeuille} from '../../components/portefeuilles/cours-portefeuille.class';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TableauxService {
  private static readonly TABLEAUX: string = 'tableaux';
  private cleMessageErreur?: string;

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
    return {};
  }

  public enregistrer(tableaux: DTOTableaux): void {
    window.localStorage.setItem(TableauxService.TABLEAUX, JSON.stringify(tableaux));
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
    return '{}';
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

  public colonneAvecParametre(colonne: DTOColonnePortefeuille) {
    const type = colonne.type;
    return type === TypeColonnePortefeuille.COURS
      || type === TypeColonnePortefeuille.MOYENNE_MOBILE
      || type === TypeColonnePortefeuille.VARIATION;
  }

  public valeur(colonne: DTOColonnePortefeuille): Function {
    switch (colonne.type) {
      case TypeColonnePortefeuille.DATE:
        return (cours: CoursPortefeuille) => this.datePipe.transform(cours.date, 'dd/MM/yyyy');
      case TypeColonnePortefeuille.MARCHE:
        return (cours: CoursPortefeuille) => this.translateService.instant('ENUMERATIONS.MARCHE.' + cours.marche);
      case TypeColonnePortefeuille.TICKER:
        return (cours: CoursPortefeuille) => cours.ticker;
      case TypeColonnePortefeuille.LIBELLE:
        return (cours: CoursPortefeuille) => cours.libelle;
      case TypeColonnePortefeuille.OUVERTURE:
        return (cours: CoursPortefeuille) => this.currencyPipe.transform(cours.ouverture, '€');
      case TypeColonnePortefeuille.PLUS_HAUT:
        return (cours: CoursPortefeuille) => this.currencyPipe.transform(cours.plusHaut, '€');
      case TypeColonnePortefeuille.PLUS_BAS:
        return (cours: CoursPortefeuille) => this.currencyPipe.transform(cours.plusHaut, '€');
      case TypeColonnePortefeuille.CLOTURE:
        return (cours: CoursPortefeuille) => this.currencyPipe.transform(cours.cloture, '€');
      case TypeColonnePortefeuille.VOLUME:
        return (cours: CoursPortefeuille) => this.decimalPipe.transform(cours.volume);
      case TypeColonnePortefeuille.ALERTES:
        return (cours: CoursPortefeuille) => cours.alertes;
      case TypeColonnePortefeuille.COURS:
        return (cours: CoursPortefeuille) => this.currencyPipe.transform(cours.coursAlleges[colonne.parametre! - 1].cloture, '€');
      case TypeColonnePortefeuille.MOYENNE_MOBILE:
        return (cours: CoursPortefeuille) => this.currencyPipe.transform(cours.moyennesMobiles[colonne.parametre! - 1], '€');
      case TypeColonnePortefeuille.VARIATION:
        return (cours: CoursPortefeuille) => this.percentPipe.transform(cours.calculerVariation2(colonne.parametre!), '1.2-2');
    }
  }

  private validerTableaux(tableaux: DTOTableaux): boolean {
    this.cleMessageErreur = undefined;
    if (tableaux.portefeuille) {
      const portefeuille: DTOTableauPortefeuille = tableaux.portefeuille;
      if (!(portefeuille.colonnesPaysage instanceof Array)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE_REQUIS';
        return false;
      }
      if (!this.validerLargeurs(portefeuille.colonnesPaysage)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE_TOTAL_LARGEUR';
        return false;
      }
      if (!this.uniciteColonnes(portefeuille.colonnesPaysage)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE_UNIQUES';
        return false;
      }
      if (!(portefeuille.colonnesPortrait instanceof Array)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT_REQUIS';
        return false;
      }
      if (!this.validerLargeurs(portefeuille.colonnesPortrait)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT_TOTAL_LARGEUR';
        return false;
      }
      if (!this.uniciteColonnes(portefeuille.colonnesPortrait)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT_UNIQUES';
        return false;
      }
    }
    return true;
  }

  private validerLargeurs(colonnes: DTOColonnePortefeuille[]) {
    return 100 === colonnes.reduce((accumulator, colonne) => accumulator + colonne.largeur, 0);
  }

  private uniciteColonnes(colonnes: DTOColonnePortefeuille[]) {
    const types: Set<TypeColonnePortefeuille> = new Set();
    for (const colonne of colonnes) {
      if (!this.colonneAvecParametre(colonne)) {
        if (types.has(colonne.type)) {
          return false;
        } else {
          types.add(colonne.type);
        }
      }
    }
    return true;
  }
}
