import {DTOCotations} from '../../services/yahoo/dto-cotations.interface';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {DTOAchat} from '../../services/valeurs/dto-achat.interface';

export class CotationsDecorees {
  valeur: DTOValeur;
  achat?: DTOAchat;
  variationAchat?: number;
  cotations: DTOCotations[];
  variationDernierCours?: number;
  notifierVariationDernierCours: boolean;
  seuilCours?: number;
  notifierSeuilCours: boolean;
  notifications: string[];

  constructor(valeur: DTOValeur, achat?: DTOAchat) {
    this.valeur = valeur;
    this.achat = achat;
    this.cotations = [];
    this.notifierVariationDernierCours = false;
    this.notifierSeuilCours = false;
    this.notifications = [];
  }
}
