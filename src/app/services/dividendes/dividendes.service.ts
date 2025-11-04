import {Injectable} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {DTODividendes} from './dto-dividendes.class';
import {TranslateService} from '@ngx-translate/core';
import {TypeDividende} from './type-dividende.enum';

@Injectable({
  providedIn: 'root'
})
export class DividendesService {
  private static readonly DIVIDENDES: string = 'dividendes';
  private static readonly OBSERVERS_IMPORT_DIVIDENDES: Array<Subscriber<DTODividendes>> = [];
  private static readonly OBSERVABLE_IMPORT_DIVIDENDES: Observable<DTODividendes> = new Observable(observer => {
    DividendesService.OBSERVERS_IMPORT_DIVIDENDES.push(observer);
  });

  private cleMessageErreur: string | undefined;

  constructor(private translateService: TranslateService) {
  }

  public charger(): DTODividendes | undefined {
    const json = window.localStorage.getItem(DividendesService.DIVIDENDES);
    if (json) {
      try {
        const dividendes: any = JSON.parse(json);
        if (this.validerDividendes(dividendes)) {
          return dividendes;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return undefined;
  }

  private validerDividendes(dividendes: DTODividendes): boolean {
    this.cleMessageErreur = undefined;
    if (isNaN(Date.parse(dividendes.dateRecuperation))) {
      this.cleMessageErreur = 'SERVICES.DIVIDENDES.ERREURS.DIVIDENDES.DATE_RECUPERATION_REQUISE';
      return false;
    }
    for (const dividende of dividendes.dividendes) {
      if (isNaN(Date.parse(dividende.date))) {
        this.cleMessageErreur = 'SERVICES.DIVIDENDES.ERREURS.DIVIDENDES.DATE_REQUISE';
        return false;
      }
      if (typeof dividende.ticker !== 'string') {
        this.cleMessageErreur = 'SERVICES.DIVIDENDES.ERREURS.DIVIDENDES.TICKER_REQUIS';
        return false;
      }
      if (!Object.values(TypeDividende).includes(dividende.type)) {
        this.cleMessageErreur = 'SERVICES.DIVIDENDES.ERREURS.DIVIDENDES.TYPE_DIVIDENDE_REQUIS';
        return false;
      }
      if (typeof dividende.montant !== 'number') {
        this.cleMessageErreur = 'SERVICES.DIVIDENDES.ERREURS.DIVIDENDES.MONTANT_REQUIS';
        return false;
      }
      if (typeof dividende.pourcentageRendement !== 'number') {
        this.cleMessageErreur = 'SERVICES.DIVIDENDES.ERREURS.DIVIDENDES.POURCENTAGE_RENDEMENT_REQUIS';
        return false;
      }
    }
    return true;
  }

  public onImportDividendes(handler: ((value: DTODividendes) => void)): void {
    DividendesService.OBSERVABLE_IMPORT_DIVIDENDES.subscribe(handler);
  }

  public enregistrer(dividendes: DTODividendes): string | undefined {
    if (this.validerDividendes(dividendes)) {
      window.localStorage.setItem(DividendesService.DIVIDENDES, JSON.stringify(dividendes));
      DividendesService.OBSERVERS_IMPORT_DIVIDENDES.forEach(observer => observer.next(dividendes));
      return undefined;
    } else {
      return this.translateService.instant(this.cleMessageErreur!);
    }
  }
}
