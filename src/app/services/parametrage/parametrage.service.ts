import {Injectable} from '@angular/core';
import {ValeursService} from '../valeurs/valeurs.service';
import {CoursService} from '../cours/cours.service';
import {PortefeuillesService} from '../portefeuilles/portefeuilles.service';
import {TableauxService} from '../tableaux/tableaux.service';
import {DTOParametrage} from './dto-parametrage.interface';
import {DTOValeur} from '../valeurs/dto-valeur.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  DTORestauration
} from './dto-restauration.class';

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
              private tableauxService: TableauxService) {
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
      tableaux: this.tableauxService.charger()
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
        });
        return o;
      });
    } else {
      return new Observable(observer => observer.complete());
    }
  }
}
