import {TestBed} from '@angular/core/testing';

import {LocalStorageService} from './local-storage.service';
import {LocalStorable} from './local-storable.enum';

describe('LocalStorage', () => {
  let service: LocalStorageService;
  let mockLocalStorage: Record<string, string>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    mockLocalStorage = {};
    spyOn(window.localStorage, 'getItem').and.callFake(
      (key: string) => mockLocalStorage[key] || null
    );
    spyOn(window.localStorage, 'setItem').and.callFake(
      (key: string, value: string) => mockLocalStorage[key] = value
    );
  });

  it('Given #enregistrerDTO when #chargerDTO then on récupère le DTO', () => {
    const dto = {aPropos: 'A propos'};
    let resultat: any;
    service.onUpdate((value: { cle: LocalStorable, dtoByTicker: any }) => resultat = value);
    service.enregistrerDTO(LocalStorable.DTOIdentiteTickerAbcbourse, 'GLE', dto);
    expect(service.chargerDTO(LocalStorable.DTOIdentiteTickerAbcbourse, 'GLE')).toEqual(dto);
    expect(resultat).toEqual({
      cle: 'dtoIdentiteTickerAbcbourse',
      dtoByTicker:
        {
          GLE: {aPropos: 'A propos'}
        }
    });
  });
});
