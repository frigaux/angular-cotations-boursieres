import {TestBed} from '@angular/core/testing';

import {ValeursService} from './valeurs.service';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {firstValueFrom} from 'rxjs';
import {DTOValeur} from './dto-valeur.interface';
import {RouterModule} from '@angular/router';
import {ACHATS, VALEURS} from '../jdd/jdd-valeurs.dataset';
import {TranslateModule} from '@ngx-translate/core';
import {PORTEFEUILLES} from '../jdd/jdd-portefeuilles.dataset';

describe('ValeursService', () => {
  let valeursService: ValeursService;
  let httpTesting: HttpTestingController;

  const cloneACHATS: Function = () => JSON.parse(JSON.stringify(ACHATS), valeursService.reviverAchatsTicker);

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

  it('Given des achats when #enregistrer then #charger renvoie les achats', () => {
    expect(valeursService.enregistrer(cloneACHATS())).toBeUndefined();
    expect(valeursService.charger()).toEqual(ACHATS);
  });

  it('Given des achats valides when #import then #charger renvoie les achats', () => {
    expect(valeursService.import(JSON.stringify(ACHATS))).toBeUndefined();
    expect(valeursService.charger()).toEqual(ACHATS);
  });

  it('Given des achats invalides when #import then on récupère un message d\'erreur', () => {
    expect(valeursService.import('[{}]'))
      .toBe('SERVICES.VALEURS.ERREURS.ACHATS.TICKER_REQUIS');
    expect(valeursService.import('[{"ticker": "GLE"}]'))
      .toBe('SERVICES.VALEURS.ERREURS.ACHATS.ACHATS_REQUIS');
    expect(valeursService.import('[{"ticker": "GLE", "achats":[]}]'))
      .toBeUndefined();
    expect(valeursService.import('[{"ticker": "GLE", "achats":[{"date": "2025-07-24T16:33:33.048Z"}]}]'))
      .toBe('SERVICES.VALEURS.ERREURS.ACHATS.ACHAT.QUANTITE_REQUISE');
    expect(valeursService.import('[{"ticker": "GLE", "achats":[{"date": "2025-07-24T16:33:33.048Z", "quantite": 10}]}]'))
      .toBe('SERVICES.VALEURS.ERREURS.ACHATS.ACHAT.PRIX_REQUIS');
    expect(valeursService.import('[{"ticker": "GLE", "achats":[{"date": "2025-07-24T16:33:33.048Z", "quantite": 10, "prix": 1.2}]}]'))
      .toBe('SERVICES.VALEURS.ERREURS.ACHATS.ACHAT.REVENDU_REQUIS');
    expect(valeursService.import('[{"ticker": "GLE", "achats":[{"quantite": 10, "prix": 1.2, "revendu": false}]}]'))
      .toBe('SERVICES.VALEURS.ERREURS.ACHATS.ACHAT.DATE_REQUIS');
  });
});
