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
    CotationsDecorees.determinerSeuilCoursParDefaut(this, achat);
  }

  // static car le clonage abandonne les fonctions
  private static determinerSeuilCoursParDefaut(cotations: CotationsDecorees, achat: DTOAchat | undefined) {
    if (achat) {
      switch (EtapeValeurUtil.etapeValeur(achat)) {
        case EtapeValeur.ORDRE_ACHAT:
          cotations.seuilCours = achat.prix;
          break;
        case EtapeValeur.ORDRE_VENTE:
          cotations.seuilCours = achat.prixRevente;
          break;
        default:
          cotations.seuilCours = undefined;
          break;
      }
    } else {
      cotations.seuilCours = undefined;
    }
  }

  // static car le clonage abandonne les fonctions
  public static cloner(cotations: CotationsDecorees, achat?: DTOAchat): CotationsDecorees {
    cotations = JSON.parse(JSON.stringify(cotations));
    cotations.achat = achat
    CotationsDecorees.determinerSeuilCoursParDefaut(cotations, achat);
    return cotations;
  }
}
