import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {DTOAchat} from '../../services/valeurs/dto-achat.interface';
import {DTOCotations} from '../../services/bourse-direct/dto-cotations.interface';
import {DTOCoursAvecListeAllege} from '../../services/cours/dto-cours-avec-liste-allege.interface';
import {EtapeValeurUtil} from '../valeurs/achats-valeur/etape-valeur-util.class';
import {EtapeValeur} from '../valeurs/achats-valeur/etape-valeur.enum';

export class CotationsDecorees {
  valeur: DTOValeur;
  achat?: DTOAchat;
  cours?: DTOCoursAvecListeAllege;
  plusBas?: number;
  plusHaut?: number;
  variationAchat?: number;
  cotations: DTOCotations[];
  variationPrecedent?: number;
  iconeVariationPrecedent?: string;
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
    if (achat) {
      switch (EtapeValeurUtil.etapeValeur(achat)) {
        case EtapeValeur.ORDRE_ACHAT:
          this.seuilCours = achat.prix;
          break;
        case EtapeValeur.ORDRE_VENTE:
          this.seuilCours = achat.prixRevente;
          break;
      }
    }
  }
}
