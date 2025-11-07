import {DTOTableaux} from '../tableaux/dto-tableaux.interface';
import {TypesColonnesPortefeuille} from '../tableaux/types-colonnes-portefeuille.enum';
import {DTOColonne} from '../tableaux/dto-colonne-portefeuille.interface';

// Orientation paysage
export const COLONNE_DATE_20: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Date',
  type: TypesColonnesPortefeuille.DATE,
  tri: true,
  largeur: 20
};

export const COLONNE_MARCHE_20: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Marché',
  type: TypesColonnesPortefeuille.MARCHE,
  tri: true,
  largeur: 20
};

export const COLONNE_TICKER_20: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Ticker',
  type: TypesColonnesPortefeuille.TICKER,
  tri: true,
  largeur: 20
};

export const COLONNE_LIBELLE_40: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Libellé',
  type: TypesColonnesPortefeuille.LIBELLE,
  tri: true,
  largeur: 40
};

export const COLONNE_OUVERTURE_20: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Ouverture',
  type: TypesColonnesPortefeuille.OUVERTURE,
  tri: false,
  largeur: 20
};

export const COLONNE_PLUS_HAUT_20: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Plus haut',
  type: TypesColonnesPortefeuille.PLUS_HAUT,
  tri: false,
  largeur: 20
};

export const COLONNE_PLUS_BAS_20: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Plus bas',
  type: TypesColonnesPortefeuille.PLUS_BAS,
  tri: false,
  largeur: 20
};

export const COLONNE_CLOTURE_20: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Clôture',
  type: TypesColonnesPortefeuille.CLOTURE,
  tri: false,
  largeur: 20
};

export const COLONNE_VOLUME_20: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Clôture',
  type: TypesColonnesPortefeuille.VOLUME,
  tri: false,
  largeur: 20
};

export const COLONNE_ALERTES_20: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Alertes',
  type: TypesColonnesPortefeuille.ALERTES,
  tri: false,
  largeur: 20
};

export const COLONNE_VARIATION_ACHATS_20: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Var/Ac',
  type: TypesColonnesPortefeuille.VARIATION_ACHATS,
  tri: true,
  largeur: 20
};

export const COLONNE_COURS_20: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Cours',
  type: TypesColonnesPortefeuille.COURS,
  parametre: 1,
  tri: false,
  largeur: 20
};

export const COLONNE_MOYENNE_MOBILE_20: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'MM1',
  type: TypesColonnesPortefeuille.MOYENNE_MOBILE,
  parametre: 1,
  tri: false,
  largeur: 20
};

export const COLONNE_VARIATION_20: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Var/1j',
  type: TypesColonnesPortefeuille.VARIATION,
  parametre: 1,
  tri: true,
  largeur: 20
};

// Orientation portrait
export const COLONNE_LIBELLE_50: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Libellé',
  type: TypesColonnesPortefeuille.LIBELLE,
  tri: true,
  largeur: 50
};

export const COLONNE_ALERTES_30: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Alertes',
  type: TypesColonnesPortefeuille.ALERTES,
  tri: false,
  largeur: 30
};

export const COLONNE_DIVIDENDES_20: DTOColonne<TypesColonnesPortefeuille> = {
  nom: 'Dividendes',
  type: TypesColonnesPortefeuille.DIVIDENDES,
  tri: false,
  largeur: 20
};

export const TABLEAUX: DTOTableaux = {
  portefeuille: {
    colonnesPaysage: [COLONNE_LIBELLE_40, COLONNE_ALERTES_20, COLONNE_CLOTURE_20, COLONNE_VARIATION_20],
    colonnesPortrait: [COLONNE_LIBELLE_50, COLONNE_ALERTES_30, COLONNE_DIVIDENDES_20]
  }
};
