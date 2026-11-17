import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {DTOAchat} from '../../services/valeurs/dto-achat.interface';
import {DTOCotations} from '../../services/bourse-direct/dto-cotations.interface';

export class CotationsDecorees {
  valeur: DTOValeur;
  achat?: DTOAchat;
  variationAchat?: number;
  cotations: DTOCotations[];
  variationPrecedent?: number;
  notifierVariationPrecedent: boolean;
  variationOuverture?: number;
  seuilCours?: number;
  notifierSeuilCours: boolean;
  notifications: string[];

  constructor(valeur: DTOValeur, achat?: DTOAchat) {
    this.valeur = valeur;
    this.achat = achat;
    this.cotations = [];
    this.notifierVariationPrecedent = false;
    this.notifierSeuilCours = false;
    this.notifications = [];
  }
}
