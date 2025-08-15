import {DTOCours} from '../../services/cours/dto-cours.interface';
import {DTOCoursTicker} from '../../services/cours/dto-cours-ticker.interface';
import {DTOCoursTickerAllege} from '../../services/cours/dto-cours-ticker-allege.interface';
import {CoursPortefeuille} from '../portefeuilles/cours-portefeuille.class';

export class Cours {
  date: string; // ISO 8601 : yyyy-MM-dd
  ticker: string;
  libelle: string;
  ouverture: number;
  plusHaut: number;
  plusBas: number;
  cloture: number;
  volume: number;
  moyennesMobiles: number[];
  coursAlleges: DTOCoursTickerAllege[];
  var1?: number;

  constructor(date: string, ticker: string, libelle: string, ouverture: number, plusHaut: number, plusBas: number,
              cloture: number, volume: number, moyennesMobiles: number[], coursAlleges: DTOCoursTickerAllege[]) {
    this.date = date;
    this.ticker = ticker;
    this.libelle = libelle;
    this.ouverture = ouverture;
    this.plusHaut = plusHaut;
    this.plusBas = plusBas;
    this.cloture = cloture;
    this.volume = volume;
    this.moyennesMobiles = moyennesMobiles;
    this.coursAlleges = coursAlleges;
    if (moyennesMobiles.length > 1) {
      this.var1 = (cloture / (moyennesMobiles[1] * 2 - cloture)) - 1;
    }
  }

  public static fromDTOCours(date: string, libelle: string, dto: DTOCours) {
    return new Cours(date, dto.ticker, libelle, dto.ouverture, dto.plusHaut, dto.plusBas, dto.cloture, dto.volume, dto.moyennesMobiles, []);
  }

  public static fromDTOCoursTicker(ticker: string, libelle: string, dto: DTOCoursTicker, cours: DTOCoursTickerAllege[]) {
    return new Cours(dto.date, ticker, libelle, dto.ouverture, dto.plusHaut, dto.plusBas, dto.cloture, dto.volume, dto.moyennesMobiles, cours);
  }

  public static fromCoursPortefeuille(dto: CoursPortefeuille) {
    return new Cours(dto.date, dto.ticker, dto.libelle, dto.ouverture, dto.plusHaut, dto.plusBas, dto.cloture, dto.volume, dto.moyennesMobiles, dto.coursAlleges);
  }

  public iconeVariation(): string {
    if (this.moyennesMobiles.length > 0) {
      if (this.moyennesMobiles[0] == this.moyennesMobiles[1]) {
        return 'pi-arrow-circle-right';
      } else if (this.moyennesMobiles[0] > this.moyennesMobiles[1]) {
        return 'pi-arrow-circle-up';
      } else {
        return 'pi-arrow-circle-down';
      }
    }
    return '';
  }
}
