import {TestBed} from '@angular/core/testing';

import {ValeursService} from './valeurs.service';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {firstValueFrom} from 'rxjs';
import {DTOValeur} from './dto-valeur.interface';
import {RouterModule} from '@angular/router';
import {ACHATS, VALEURS} from '../jdd/jdd-valeurs.dataset';
import {TranslateModule} from '@ngx-translate/core';
import {AchatsTicker} from './achats-ticker.interface';

describe('ValeursService', () => {
  let valeursService: ValeursService;
  let httpTesting: HttpTestingController;

  const cloneACHATS: Function = () => JSON.parse(JSON.stringify(ACHATS), ValeursService.reviverAchatsTicker);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        TranslateModule.forRoot({})
      ],
      providers: [
        ValeursService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    valeursService = TestBed.inject(ValeursService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(valeursService).toBeTruthy();
  });

  it('#chargerValeurs doit renvoyer les valeurs', async () => {
    // 1 - création d'une promesse sur l'observable qui fait la requête HTTP de récupération des valeurs
    const promiseValeurs: Promise<DTOValeur[]> = firstValueFrom(valeursService.chargerValeurs());
    // bouchonnage de la ressource HTTP
    httpTesting.expectOne({
      method: 'GET',
      url: 'bourse/valeurs',
    }).flush(VALEURS);
    expect(await promiseValeurs).toEqual(VALEURS);
    // vérification qu'il n'y a pas de requêtes en attente
    httpTesting.verify();
  });

  it('Given des achats when #enregistrerAchats then #chargerAchats renvoie les achats', () => {
    expect(valeursService.enregistrerAchats(cloneACHATS())).toBeUndefined();
    expect(valeursService.chargerAchats()).toEqual(ACHATS);
  });

  it('Given des achats when #enregistrerAchatsTicker then #chargerAchatsTicker renvoie les achats', () => {
    const achatsTicker: AchatsTicker = cloneACHATS()[0];
    expect(valeursService.enregistrerAchatsTicker(achatsTicker.ticker, achatsTicker.achats)).toBeUndefined();
    expect(valeursService.chargerAchatsTicker(achatsTicker.ticker)).toEqual(achatsTicker.achats);
    expect(valeursService.chargerAchatsTicker('AC')).toHaveSize(0);
  });

  it('Given des achats valides when #importAchats then #chargerAchats renvoie les achats', () => {
    expect(valeursService.importAchats(JSON.stringify(ACHATS))).toBeUndefined();
    expect(valeursService.chargerAchats()).toEqual(ACHATS);
  });

  it('Given des achats invalides when #importAchats then on récupère un message d\'erreur', () => {
    expect(valeursService.importAchats('[{}]'))
      .toBe('SERVICES.VALEURS.ERREURS.ACHATS.TICKER_REQUIS');
    expect(valeursService.importAchats('[{"ticker": "GLE"}]'))
      .toBe('SERVICES.VALEURS.ERREURS.ACHATS.ACHATS_REQUIS');
    expect(valeursService.importAchats('[{"ticker": "GLE", "achats":[]}]'))
      .toBeUndefined();
    expect(valeursService.importAchats('[{"ticker": "GLE", "achats":[{"date": "2025-07-24T16:33:33.048Z"}]}]'))
      .toBe('SERVICES.VALEURS.ERREURS.ACHATS.ACHAT.QUANTITE_REQUISE');
    expect(valeursService.importAchats('[{"ticker": "GLE", "achats":[{"date": "2025-07-24T16:33:33.048Z", "quantite": 10}]}]'))
      .toBe('SERVICES.VALEURS.ERREURS.ACHATS.ACHAT.PRIX_REQUIS');
    expect(valeursService.importAchats('[{"ticker": "GLE", "achats":[{"date": "2025-07-24T16:33:33.048Z", "quantite": 10, "prix": 1.2}]}]'))
      .toBe('SERVICES.VALEURS.ERREURS.ACHATS.ACHAT.REVENDU_REQUIS');
    expect(valeursService.importAchats('[{"ticker": "GLE", "achats":[{"quantite": 10, "prix": 1.2, "revendu": false}]}]'))
      .toBe('SERVICES.VALEURS.ERREURS.ACHATS.ACHAT.DATE_REQUIS');
  });
});
