import {TestBed} from '@angular/core/testing';
import {ACHATS} from '../../../services/jdd/jdd-valeurs.dataset';
import {EtapeValeurUtil} from './etape-valeur-util.class';
import {EtapeValeur} from './etape-valeur.enum';

describe('EtapeValeurUtil', () => {

  const cloneACHATS: Function = () => JSON.parse(JSON.stringify(ACHATS));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: []
    })
      .compileComponents();
  });

  it('given des achats when #filtrerParEtape then on récupère les bons achats', () => {
    const ordresAchats = EtapeValeurUtil.filtrerParEtape(cloneACHATS(), EtapeValeur.ORDRE_ACHAT);
    const achats = EtapeValeurUtil.filtrerParEtape(cloneACHATS(), EtapeValeur.ACHAT);
    const ordresVentes = EtapeValeurUtil.filtrerParEtape(cloneACHATS(), EtapeValeur.ORDRE_VENTE);
    expect(ordresAchats).toHaveSize(1);
    expect(achats).toHaveSize(2);
    expect(ordresVentes).toHaveSize(1);
  });
});
