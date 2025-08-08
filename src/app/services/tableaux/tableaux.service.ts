import {Injectable} from '@angular/core';
import {DTOTableaux} from './dto-tableaux.interface';
import {TranslateService} from '@ngx-translate/core';
import {DTOTableau} from './dto-tableau-portefeuille.interface';
import {DTOColonne} from './dto-colonne-portefeuille.interface';
import {TypesColonnesPortefeuille} from './types-colonnes-portefeuille.enum';
import {CoursPortefeuille} from '../../components/portefeuilles/cours-portefeuille.class';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {TypesColonnesCours} from './types-colonnes-cours.enum';
import {Observable, Subscriber} from 'rxjs';
import {ValeursService} from '../valeurs/valeurs.service';

@Injectable({
  providedIn: 'root'
})
export class TableauxService {
  private static readonly TABLEAUX: string = 'tableaux';
  private static readonly OBSERVERS_IMPORT: Array<Subscriber<DTOTableaux>> = [];
  private static readonly OBSERVABLE_IMPORT: Observable<DTOTableaux> = new Observable(observer => {
    TableauxService.OBSERVERS_IMPORT.push(observer);
  });

  private cleMessageErreur?: string;

  public static readonly CONFIGURATION_INITIALE: {
    DESKTOP: DTOTableaux,
    MOBILE: DTOTableaux,
    TABLETTE: DTOTableaux
  } = {
    DESKTOP: {
      portefeuille: {
        colonnesPaysage: [
          {
            nom: "Libellé",
            type: 3,
            tri: true,
            largeur: 20
          },
          {
            nom: "Alertes",
            type: 9,
            tri: false,
            largeur: 12
          },
          {
            nom: "Clôture",
            type: 7,
            tri: false,
            largeur: 8
          },
          {
            nom: "Var/Ac",
            type: 10,
            tri: true,
            largeur: 10
          },
          {
            nom: "Var/1j",
            type: 13,
            "parametre": 1,
            tri: true,
            largeur: 10
          },
          {
            nom: "MM5",
            type: 12,
            "parametre": 5,
            tri: false,
            largeur: 8
          },
          {
            nom: "MM20",
            type: 12,
            "parametre": 20,
            tri: false,
            largeur: 8
          },
          {
            nom: "MM50",
            type: 12,
            "parametre": 50,
            tri: false,
            largeur: 8
          },
          {
            nom: "MM100",
            type: 12,
            "parametre": 100,
            tri: false,
            largeur: 8
          },
          {
            nom: "MM200",
            type: 12,
            "parametre": 200,
            tri: false,
            largeur: 8
          }
        ],
        colonnesPortrait: [
          {
            nom: "Libellé",
            type: 3,
            tri: true,
            largeur: 30
          },
          {
            nom: "Alertes",
            type: 9,
            tri: false,
            largeur: 25
          },
          {
            nom: "Clôture",
            type: 7,
            tri: false,
            largeur: 15
          },
          {
            nom: "Var/Ac",
            type: 10,
            tri: true,
            largeur: 15
          },
          {
            nom: "Var/1j",
            type: 13,
            "parametre": 1,
            tri: true,
            largeur: 15
          }
        ]
      }
    },
    MOBILE: {
      portefeuille: {
        colonnesPaysage: [
          {
            nom: 'Libellé',
            type: TypesColonnesPortefeuille.LIBELLE,
            tri: true,
            largeur: 25
          },
          {
            nom: 'Alertes',
            type: TypesColonnesPortefeuille.ALERTES,
            tri: false,
            largeur: 20
          },
          {
            nom: 'Clôture',
            type: TypesColonnesPortefeuille.CLOTURE,
            tri: false,
            largeur: 11
          },
          {
            nom: 'Var./Préc.',
            type: TypesColonnesPortefeuille.VARIATION,
            parametre: 1,
            tri: true,
            largeur: 11
          },
          {
            nom: 'MM5j',
            type: TypesColonnesPortefeuille.MOYENNE_MOBILE,
            parametre: 5,
            tri: false,
            largeur: 11
          },
          {
            nom: 'MM20j',
            type: TypesColonnesPortefeuille.MOYENNE_MOBILE,
            parametre: 20,
            tri: false,
            largeur: 11
          },
          {
            nom: 'MM50j',
            type: TypesColonnesPortefeuille.MOYENNE_MOBILE,
            parametre: 50,
            tri: false,
            largeur: 11
          }
        ],
        colonnesPortrait: [
          {
            nom: 'Libellé',
            type: TypesColonnesPortefeuille.LIBELLE,
            tri: true,
            largeur: 30
          },
          {
            nom: 'Alertes',
            type: TypesColonnesPortefeuille.ALERTES,
            tri: false,
            largeur: 25
          },
          {
            nom: 'Clôture',
            type: TypesColonnesPortefeuille.CLOTURE,
            tri: false,
            largeur: 15
          },
          {
            nom: 'Var./Préc.',
            type: TypesColonnesPortefeuille.VARIATION,
            parametre: 1,
            tri: true,
            largeur: 15
          },
          {
            nom: 'MM5j',
            type: TypesColonnesPortefeuille.MOYENNE_MOBILE,
            parametre: 5,
            tri: false,
            largeur: 15
          }
        ]
      }
    },
    TABLETTE: {
      portefeuille: {
        colonnesPaysage: [
          {
            nom: 'Libellé',
            type: TypesColonnesPortefeuille.LIBELLE,
            tri: true,
            largeur: 20
          },
          {
            nom: 'Alertes',
            type: TypesColonnesPortefeuille.ALERTES,
            tri: false,
            largeur: 17
          },
          {
            nom: 'Clôture',
            type: TypesColonnesPortefeuille.CLOTURE,
            tri: false,
            largeur: 9
          },
          {
            nom: 'Var./Préc.',
            type: TypesColonnesPortefeuille.VARIATION,
            parametre: 1,
            tri: true,
            largeur: 9
          },
          {
            nom: 'Var./5j',
            type: TypesColonnesPortefeuille.VARIATION,
            parametre: 5,
            tri: true,
            largeur: 9
          },
          {
            nom: 'MM5j',
            type: TypesColonnesPortefeuille.MOYENNE_MOBILE,
            parametre: 5,
            tri: false,
            largeur: 9
          },
          {
            nom: 'MM20j',
            type: TypesColonnesPortefeuille.MOYENNE_MOBILE,
            parametre: 20,
            tri: false,
            largeur: 9
          },
          {
            nom: 'MM50j',
            type: TypesColonnesPortefeuille.MOYENNE_MOBILE,
            parametre: 50,
            tri: false,
            largeur: 9
          },
          {
            nom: 'MM100j',
            type: TypesColonnesPortefeuille.MOYENNE_MOBILE,
            parametre: 100,
            tri: false,
            largeur: 9
          }
        ],
        colonnesPortrait: [
          {
            nom: 'Libellé',
            type: TypesColonnesPortefeuille.LIBELLE,
            tri: true,
            largeur: 30
          },
          {
            nom: 'Alertes',
            type: TypesColonnesPortefeuille.ALERTES,
            tri: false,
            largeur: 25
          },
          {
            nom: 'Clôture',
            type: TypesColonnesPortefeuille.CLOTURE,
            tri: false,
            largeur: 15
          },
          {
            nom: 'Var./Préc.',
            type: TypesColonnesPortefeuille.VARIATION,
            parametre: 1,
            tri: true,
            largeur: 15
          },
          {
            nom: 'MM5j',
            type: TypesColonnesPortefeuille.MOYENNE_MOBILE,
            parametre: 5,
            tri: false,
            largeur: 15
          }
        ]
      }
    }
  };

  constructor(private translateService: TranslateService,
              private datePipe: DatePipe,
              private percentPipe: PercentPipe,
              private currencyPipe: CurrencyPipe,
              private decimalPipe: DecimalPipe,
              private valeursService: ValeursService) {
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
    return TableauxService.CONFIGURATION_INITIALE['DESKTOP'];
  }

  public enregistrer(tableaux: DTOTableaux): string | undefined {
    if (this.validerTableaux(tableaux)) {
      window.localStorage.setItem(TableauxService.TABLEAUX, JSON.stringify(tableaux));
      return undefined;
    } else {
      return this.translateService.instant(this.cleMessageErreur!);
    }
  }

  public import(json: string): string | undefined {
    try {
      const tableaux: any = JSON.parse(json);
      if (this.validerTableaux(tableaux)) {
        window.localStorage.setItem(TableauxService.TABLEAUX, JSON.stringify(tableaux));
        TableauxService.OBSERVERS_IMPORT.forEach(observer => observer.next(tableaux));
        return undefined;
      } else {
        return this.translateService.instant(this.cleMessageErreur!);
      }
    } catch (e) { // JSON mal formé
      return (e as SyntaxError).message;
    }
  }

  public onImport(handler: ((value: DTOTableaux) => void)): void {
    TableauxService.OBSERVABLE_IMPORT.subscribe(handler);
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
      case TypesColonnesPortefeuille.VARIATION_ACHATS:
        return (cours: CoursPortefeuille) => this.percentPipe.transform(cours.calculerVariationAchats(this.valeursService), '1.2-2');
      case TypesColonnesPortefeuille.COURS:
        return (cours: CoursPortefeuille) => this.currencyPipe.transform(cours.coursAlleges[colonne.parametre! - 1].cloture, '€');
      case TypesColonnesPortefeuille.MOYENNE_MOBILE:
        return (cours: CoursPortefeuille) => this.currencyPipe.transform(cours.moyennesMobiles[colonne.parametre! - 1], '€');
      case TypesColonnesPortefeuille.VARIATION:
        return (cours: CoursPortefeuille) => this.percentPipe.transform(cours.calculerVariation(colonne.parametre!), '1.2-2');
      default:
        throw new Error(`Colonne non gérée ${colonne.type}`);
    }
  }

  private validerTableaux(tableaux: DTOTableaux): boolean {
    this.cleMessageErreur = undefined;
    if (tableaux.portefeuille) {
      const portefeuille: DTOTableau<any> = tableaux.portefeuille;
      if (!(portefeuille.colonnesPaysage instanceof Array)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE.REQUIS';
        return false;
      }
      if (!this.validerNom(portefeuille.colonnesPaysage)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PAYSAGE.NOM_REQUIS';
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
      if (!this.validerNom(portefeuille.colonnesPortrait)) {
        this.cleMessageErreur = 'SERVICES.TABLEAUX.PORTEFEUILLE.ERREURS.COLONNES_PORTRAIT.NOM_REQUIS';
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

  private validerNom<T extends TypesColonnesPortefeuille | TypesColonnesCours>(colonnes: DTOColonne<T>[]): boolean {
    return colonnes.find(colonne =>
      typeof colonne.nom !== "string" || colonne.nom.length === 0
    ) === undefined;
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
      colonne.largeur === undefined || isNaN(colonne.largeur) || colonne.largeur < 1
    ) === undefined;
  }

  private validerParametres<T extends TypesColonnesPortefeuille | TypesColonnesCours>(colonnes: DTOColonne<T>[]): boolean {
    return colonnes.find(colonne =>
      this.typeAvecParametre(colonne.type) && (colonne.parametre === undefined || isNaN(colonne.parametre) || colonne.parametre < 1)
    ) === undefined;
  }
}
