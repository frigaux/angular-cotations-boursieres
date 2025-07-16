import {DTOTableaux} from '../tableaux/dto-tableaux.interface';
import {TypeColonnePortefeuille} from '../tableaux/type-colonne-portefeuille.enum';
import {DTOColonnePortefeuille} from '../tableaux/dto-colonne-portefeuille.interface';

// Orientation paysage
export const COLONNE_DATE_20: DTOColonnePortefeuille = {
  nom: 'Date',
  type: TypeColonnePortefeuille.DATE,
  tri: true,
  largeur: 20
};

export const COLONNE_MARCHE_20: DTOColonnePortefeuille = {
  nom: 'Marché',
  type: TypeColonnePortefeuille.MARCHE,
  tri: true,
  largeur: 20
};

export const COLONNE_TICKER_20: DTOColonnePortefeuille = {
  nom: 'Ticker',
  type: TypeColonnePortefeuille.TICKER,
  tri: true,
  largeur: 20
};

export const COLONNE_LIBELLE_40: DTOColonnePortefeuille = {
  nom: 'Libellé',
  type: TypeColonnePortefeuille.LIBELLE,
  tri: true,
  largeur: 40
};

export const COLONNE_OUVERTURE_20: DTOColonnePortefeuille = {
  nom: 'Ouverture',
  type: TypeColonnePortefeuille.OUVERTURE,
  tri: false,
  largeur: 20
};

export const COLONNE_PLUS_HAUT_20: DTOColonnePortefeuille = {
  nom: 'Plus haut',
  type: TypeColonnePortefeuille.PLUS_HAUT,
  tri: false,
  largeur: 20
};

export const COLONNE_PLUS_BAS_20: DTOColonnePortefeuille = {
  nom: 'Plus bas',
  type: TypeColonnePortefeuille.PLUS_BAS,
  tri: false,
  largeur: 20
};

export const COLONNE_CLOTURE_20: DTOColonnePortefeuille = {
  nom: 'Clôture',
  type: TypeColonnePortefeuille.CLOTURE,
  tri: false,
  largeur: 20
};

export const COLONNE_VOLUME_20: DTOColonnePortefeuille = {
  nom: 'Clôture',
  type: TypeColonnePortefeuille.VOLUME,
  tri: false,
  largeur: 20
};

export const COLONNE_ALERTES_20: DTOColonnePortefeuille = {
  nom: 'Alertes',
  type: TypeColonnePortefeuille.ALERTES,
  tri: false,
  largeur: 20
};

export const COLONNE_COURS_20: DTOColonnePortefeuille = {
  nom: 'Cours',
  type: TypeColonnePortefeuille.COURS,
  parametre: 1,
  tri: false,
  largeur: 20
};

export const COLONNE_MOYENNE_MOBILE_20: DTOColonnePortefeuille = {
  nom: 'Alertes',
  type: TypeColonnePortefeuille.MOYENNE_MOBILE,
  parametre: 1,
  tri: false,
  largeur: 20
};

export const COLONNE_VARIATION_20: DTOColonnePortefeuille = {
  nom: 'Var/1j',
  type: TypeColonnePortefeuille.VARIATION,
  parametre: 1,
  tri: true,
  largeur: 20
};

// Orientation portrait
export const COLONNE_LIBELLE_50: DTOColonnePortefeuille = {
  nom: 'Libellé',
  type: TypeColonnePortefeuille.LIBELLE,
  tri: true,
  largeur: 50
};

export const COLONNE_ALERTES_50: DTOColonnePortefeuille = {
  nom: 'Alertes',
  type: TypeColonnePortefeuille.ALERTES,
  tri: false,
  largeur: 50
};

export const TABLEAUX: DTOTableaux = {
  portefeuille: {
    colonnesPaysage: [COLONNE_LIBELLE_40, COLONNE_ALERTES_20, COLONNE_CLOTURE_20, COLONNE_VARIATION_20],
    colonnesPortrait: [COLONNE_LIBELLE_50, COLONNE_ALERTES_50]
  }
};
