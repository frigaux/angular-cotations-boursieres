import {Injectable} from '@angular/core';
import {ValeursService} from '../valeurs/valeurs.service';
import {CoursService} from '../cours/cours.service';
import {PortefeuillesService} from '../portefeuilles/portefeuilles.service';
import {TableauxService} from '../tableaux/tableaux.service';
import {DTOParametrage} from './dto-parametrage.interface';
import {DTOValeur} from '../valeurs/dto-valeur.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

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

  restaurer() {
    const url = this.chargerUrlSauvegardeRestauration();
    if (url && URL.canParse(url)) {
      return this.http.get<DTOParametrage>(
        url,
        {headers: ParametrageService.HEADERS}
      ).pipe(o => {
        o.subscribe(dto => {
          this.valeursService.enregistrerAchats(dto.achats);
          this.coursService.enregistrerFiltres(dto.filtres);
          this.portefeuillesService.enregistrer(dto.portefeuilles);
          this.tableauxService.enregistrer(dto.tableaux);
        });
        return o;
      });
    } else {
      return new Observable(observer => observer.complete());
    }
  }
}
