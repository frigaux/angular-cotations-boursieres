import {PortefeuillesService} from './portefeuilles.service';
import {PORTEFEUILLES} from '../jdd/jdd-portefeuille.dataset';

describe('PortefeuillesService', () => {
  let service: PortefeuillesService;

  beforeEach(() => {
    service = new PortefeuillesService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Given des portefeuilles when #enregistrer then #charger renvoie les portefeuilles', () => {
    service.enregistrer(PORTEFEUILLES);
    expect(service.charger()).toEqual(PORTEFEUILLES);
  });

  it('Given des portefeuilles when #import then #export renvoie les portefeuilles', () => {
    const portefeuilles = JSON.stringify(PORTEFEUILLES);
    service.import(portefeuilles);
    expect(service.export()).toEqual(portefeuilles);
  });
});
