import {DTOOrdre} from './dto-ordre.interface';
import {DTOInformation} from './dto-information.interface';
import {CoursPortefeuille} from '../../components/portefeuilles/cours-portefeuille.class';
import {DTOCotations} from './dto-cotations.interface';
import {Marches} from '../valeurs/marches.enum';
import {DTOValeur} from './dto-valeur.interface';
import {DTOPoint} from './dto-point.interface';

export interface DTOInformationsTickerBoursorama {
  valeur: DTOValeur;
  cotations: DTOCotations;
  courbeCours: Array<DTOPoint>;
  achats: Array<DTOOrdre>;
  ventes: Array<DTOOrdre>;
  actualites: Array<DTOInformation>;
  analyses: Array<DTOInformation>;
}
