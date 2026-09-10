import {Injectable} from '@angular/core';
import {ValeursService} from '../valeurs/valeurs.service';
import {CoursService} from '../cours/cours.service';
import {PortefeuillesService} from '../portefeuilles/portefeuilles.service';
import {TableauxService} from '../tableaux/tableaux.service';
import {DTOParametrage} from './dto-parametrage.interface';
import {DTOValeur} from '../valeurs/dto-valeur.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DTORestauration} from './dto-restauration.class';
import {DividendesService} from '../dividendes/dividendes.service';
import {LocalStorable} from '../local-storage/local-storable.enum';
import {LocalStorageService} from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrageService {
  private static readonly URL_SAUVEGARDE_RESTAURATION = 'urlSauvegardeRestauration';
  private static readonly HEADERS = new HttpHeaders()
    .set('Content-Type', 'application/json');

  constructor(private http: HttpClient,
              private valeursService: ValeursService,
              private coursService: CoursService,
              private portefeuillesService: PortefeuillesService,
              private tableauxService: TableauxService,
              private dividendesService: DividendesService,
              private localStorageService: LocalStorageService) {
  }

  public chargerUrlSauvegardeRestauration(): string | undefined {
    return window.localStorage.getItem(ParametrageService.URL_SAUVEGARDE_RESTAURATION) || undefined;
  }

  public enregistrerUrlSauvegardeRestauration(cleAPIGemini: string): void {
    window.localStorage.setItem(ParametrageService.URL_SAUVEGARDE_RESTAURATION, cleAPIGemini);
  }

  sauvegarder() {
    const json: DTOParametrage = {
      achats: this.valeursService.chargerAchats(),
      filtres: this.coursService.chargerFiltres(),
      portefeuilles: this.portefeuillesService.charger(),
      tableaux: this.tableauxService.charger(),
      dividendes: this.dividendesService.charger(),
      dtoInformationsTickerABCBourse: this.localStorageService.chargerDTOs(LocalStorable.DTOInformationsTickerABCBourse),
      dtoIdentiteTickerAbcbourse: this.localStorageService.chargerDTOs(LocalStorable.DTOIdentiteTickerAbcbourse)
    };
    const url = this.chargerUrlSauvegardeRestauration();
    if (url && URL.canParse(url)) {
      return this.http.post<DTOValeur[]>(
        url,
        json,
        {headers: ParametrageService.HEADERS}
      );
    } else {
      return new Observable(observer => observer.complete());
    }
  }

  restaurer(dtoRestauration: DTORestauration) {
    const url = this.chargerUrlSauvegardeRestauration();
    if (url && URL.canParse(url)) {
      return this.http.get<DTOParametrage>(
        url,
        {headers: ParametrageService.HEADERS}
      ).pipe(o => {
        o.subscribe(dto => {
          if (dtoRestauration.achats) {
            this.valeursService.enregistrerAchats(dto.achats);
          }
          if (dtoRestauration.filtres) {
            this.coursService.enregistrerFiltres(dto.filtres);
          }
          if (dtoRestauration.portefeuilles) {
            this.portefeuillesService.enregistrer(dto.portefeuilles);
          }
          if (dtoRestauration.tableaux) {
            this.tableauxService.enregistrer(dto.tableaux);
          }
          if (dtoRestauration.dividendes && dto.dividendes) {
            this.dividendesService.enregistrer(dto.dividendes);
          }
          if (dtoRestauration.dto) {
            this.localStorageService.enregistrerDTOByTicker(LocalStorable.DTOInformationsTickerABCBourse, dto.dtoInformationsTickerABCBourse);
            this.localStorageService.enregistrerDTOByTicker(LocalStorable.DTOIdentiteTickerAbcbourse, dto.dtoIdentiteTickerAbcbourse);
          }
        });
        return o;
      });
    } else {
      return new Observable(observer => observer.complete());
    }
  }
}
