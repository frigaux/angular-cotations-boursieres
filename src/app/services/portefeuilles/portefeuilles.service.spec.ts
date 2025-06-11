import {PortefeuillesService} from './portefeuilles.service';
import {PORTEFEUILLES} from '../jdd/jdd-portefeuille.dataset';
import {DTOPortefeuille} from '../../components/portefeuilles/gestion-portefeuilles/dto-portefeuille.interface';

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

  describe('Given des portefeuilles', () => {
    let resultatImport: DTOPortefeuille[] = [];
    const portefeuilles = JSON.stringify(PORTEFEUILLES);

    beforeEach(() => {
      service.onImport(portefeuilles => resultatImport = portefeuilles);
    });

    it('when #import then #export renvoie les portefeuilles', () => {
      expect(service.import(portefeuilles)).toBeTrue();
      expect(resultatImport).toEqual(PORTEFEUILLES);
      expect(service.export()).toEqual(portefeuilles);
    });
  });
});
