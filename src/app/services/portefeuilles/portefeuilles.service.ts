import {Injectable} from '@angular/core';
import {DTOPortefeuille} from './dto-portefeuille.interface';
import {Observable, Subscriber} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PortefeuillesService {
  private static readonly PORTEFEUILLES: string = 'portefeuilles';
  public static readonly PORTEFEUILLE_ACHATS: string = 'Achats';
  private static readonly OBSERVERS_IMPORT: Array<Subscriber<Array<DTOPortefeuille>>> = [];
  private static readonly OBSERVERS_UPDATE: Array<Subscriber<Array<DTOPortefeuille>>> = [];
  private static readonly OBSERVABLE_IMPORT: Observable<Array<DTOPortefeuille>> = new Observable(observer => {
    PortefeuillesService.OBSERVERS_IMPORT.push(observer);
  });
  private static readonly OBSERVABLE_UPDATE: Observable<Array<DTOPortefeuille>> = new Observable(observer => {
    PortefeuillesService.OBSERVERS_UPDATE.push(observer);
  });

  private cleMessageErreur: string | undefined;

  public static readonly CONFIGURATION_INITIALE = [
    {
      nom: 'Cac40',
      parDefaut: true,
      tickers: [
        'ACA',
        'AI',
        'CA',
        'AC',
        'EN',
        'CS',
        'BN',
        'EL',
        'CAP',
        'BNP',
        'BVI',
        'ENGI',
        'EDEN',
        'DSY',
        'MT',
        'AIR',
        'ERF',
        'RMS',
        'KER',
        'LR',
        'OR',
        'MC',
        'ML',
        'ORA',
        'RI',
        'PUB',
        'RNO',
        'SAF',
        'SGO',
        'SAN',
        'SU',
        'GLE',
        'STLAP',
        'STMPA',
        'TEP',
        'HO',
        'TTE',
        'URW',
        'VIE',
        'DG'
      ],
      alertes: [
        {
          nom: 'Creux',
          condition: 'M20 > M10 && M10 > M5 && C2 < (0.995 * C1)'
        },
        {
          nom: 'Sommet',
          condition: 'M20 < M10 && M10 < M5 && C2 > (1.005 * C1)'
        },
        {
          nom: 'Choc',
          condition: 'C2 < 0.98 * C1 || C2 > 1.02 * C1'
        }
      ]
    },
    {
      nom: 'Charles Gave',
      parDefaut: false,
      tickers: [
        'AC',
        'AI',
        'CAP',
        'BN',
        'RMS',
        'KER',
        'OR',
        'MC',
        'RI',
        'SU',
        'SW',
        'TTE'
      ],
      alertes: [
        {
          nom: 'Creux',
          condition: 'M20 > M10 && M10 > M5 && C2 < (0.995 * C1)'
        },
        {
          nom: 'Sommet',
          condition: 'M20 < M10 && M10 < M5 && C2 > (1.005 * C1)'
        },
        {
          nom: 'Choc',
          condition: 'C2 < 0.98 * C1 || C2 > 1.02 * C1'
        }
      ]
    }
  ];

  constructor(private translateService: TranslateService) {
  }

  public charger(): Array<DTOPortefeuille> {
    const json = window.localStorage.getItem(PortefeuillesService.PORTEFEUILLES);
    if (json) {
      try {
        const portefeuilles: any = JSON.parse(json);
        if (this.validerPortefeuilles(portefeuilles)) {
          return portefeuilles;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  }

  /**
   *
   * @param portefeuilles les tickers doivent appartenir à la liste renvoyée par ValeursService.chargerValeurs
   */
  public enregistrer(portefeuilles: Array<DTOPortefeuille>): string | undefined {
    if (this.validerPortefeuilles(portefeuilles)) {
      window.localStorage.setItem(PortefeuillesService.PORTEFEUILLES, JSON.stringify(portefeuilles));
      PortefeuillesService.OBSERVERS_UPDATE.forEach(observer => observer.next(portefeuilles));
      return undefined;
    } else {
      return this.translateService.instant(this.cleMessageErreur!);
    }
  }

  public import(json: string): string | undefined {
    try {
      const portefeuilles: any = JSON.parse(json);
      if (this.validerPortefeuilles(portefeuilles)) {
        window.localStorage.setItem(PortefeuillesService.PORTEFEUILLES, JSON.stringify(portefeuilles));
        PortefeuillesService.OBSERVERS_IMPORT.forEach(observer => observer.next(portefeuilles));
        PortefeuillesService.OBSERVERS_UPDATE.forEach(observer => observer.next(portefeuilles));
        return undefined;
      } else {
        return this.translateService.instant(this.cleMessageErreur!);
      }
    } catch (e) { // JSON mal formé
      return (e as SyntaxError).message;
    }
  }

  public onImport(handler: ((value: Array<DTOPortefeuille>) => void)): void {
    PortefeuillesService.OBSERVABLE_IMPORT.subscribe(handler);
  }

  /**
   * Enregistrements et imports.
   * @param handler lambda avec les portefeuilles en paramètre
   */
  public onUpdate(handler: ((value: Array<DTOPortefeuille>) => void)): void {
    PortefeuillesService.OBSERVABLE_UPDATE.subscribe(handler);
  }

  private validerPortefeuilles(portefeuilles: any): boolean {
    this.cleMessageErreur = undefined;
    if (portefeuilles instanceof Array) {
      if (portefeuilles.find(portefeuille =>
        !portefeuille.hasOwnProperty('nom'))) {
        this.cleMessageErreur = 'SERVICES.PORTEFEUILLES.ERREURS.NOM_REQUIS';
        return false;
      }
      if (portefeuilles.find(portefeuille =>
        !portefeuille.hasOwnProperty('parDefaut'))) {
        this.cleMessageErreur = 'SERVICES.PORTEFEUILLES.ERREURS.PAR_DEFAUT_REQUIS';
        return false;
      }
      if (portefeuilles.find(portefeuille =>
        !portefeuille.hasOwnProperty('tickers'))) {
        this.cleMessageErreur = 'SERVICES.PORTEFEUILLES.ERREURS.TICKERS_REQUIS';
        return false;
      }
      if (portefeuilles.find(portefeuille =>
        !portefeuille.hasOwnProperty('alertes'))) {
        this.cleMessageErreur = 'SERVICES.PORTEFEUILLES.ERREURS.ALERTES_REQUIS';
        return false;
      }
      for (const portefeuille of portefeuilles) {
        if (this.validerAlertes(portefeuille.alertes) !== undefined) {
          this.cleMessageErreur = 'SERVICES.PORTEFEUILLES.ERREURS.ALERTES_INVALIDES';
          return false;
        }
      }
      if (portefeuilles.length > 0
        && portefeuilles.filter(portefeuille => portefeuille.parDefaut).length !== 1) {
        this.cleMessageErreur = 'SERVICES.PORTEFEUILLES.ERREURS.UN_SEUL_PAR_DEFAUT';
        return false;
      }
    } else {
      this.cleMessageErreur = 'SERVICES.PORTEFEUILLES.ERREURS.TABLEAU_REQUIS';
      return false;
    }
    return true;
  }

  public auMoinsUnPortefeuilleCorrectementConfigure(): boolean {
    const portefeuilleAvecAuMoinsUneValeur: DTOPortefeuille | undefined = this.charger()
      .find(portefeuille => portefeuille.tickers.length > 0);
    return portefeuilleAvecAuMoinsUneValeur !== undefined;
  }

  public portefeuilleParDefaut(): DTOPortefeuille | undefined {
    return this.charger()
      .find(portefeuille => portefeuille.parDefaut);
  }

  public validerAlertes(alertes: any): string | undefined {
    this.cleMessageErreur = undefined;
    if (alertes instanceof Array) {
      for (const alerte of alertes) {
        if (!alerte.hasOwnProperty('nom') || alerte.nom.length === 0) {
          return this.translateService.instant('SERVICES.PORTEFEUILLES.ERREURS.ALERTES.NOM_REQUIS');
        }
        if (!alerte.hasOwnProperty('condition') || alerte.condition.length === 0) {
          return this.translateService.instant('SERVICES.PORTEFEUILLES.ERREURS.ALERTES.CONDITION_REQUISE');
        }
        if (this.validerCondition(alerte.condition) !== undefined) {
          return this.translateService.instant('SERVICES.PORTEFEUILLES.ERREURS.ALERTES.CONDITION_INVALIDE');
        }
      }
    } else {
      return this.translateService.instant('SERVICES.COURS.ERREURS.ALERTES_REQUIS');
    }
    return undefined;
  }

  public validerCondition(condition: string): string | undefined {
    const conditionAvecSubstitution = condition
      .replaceAll(/C(\d+)/gi, (match, token) => {
        return `C[${token - 1}]`;
      })
      .replaceAll(/M(\d+)/gi, (match, token) => {
        return `M[${token - 1}]`;
      });
    try {
      const evaluerCondition = new Function(
        'const C = Array.from({ length: 300 }, (v, i) => i);'
        + 'const M = Array.from({ length: 300 }, (v, i) => i);'
        + 'const MIN = 0; const MAX = 299; const MOY = 149.5; const NBV = 5;'
        + 'return ' + conditionAvecSubstitution + ';'
      );
      evaluerCondition();
    } catch (e: unknown) {
      return (e as SyntaxError).message;
    }
    return undefined;
  }
}
