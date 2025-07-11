import {DTOCours} from '../../services/cours/dto-cours.interface';
import {DTOCoursTicker} from '../../services/cours/dto-cours-ticker.interface';
import {DTOCoursTickerAllege} from '../../services/cours/dto-cours-ticker-allege.interface';
import {CoursPortefeuille} from '../portefeuilles/cours-portefeuille.class';

export class Cours {
  date: Date;
  ticker: string;
  libelle: string;
  ouverture: number;
  plusHaut: number;
  plusBas: number;
  cloture: number;
  volume: number;
  moyennesMobiles: number[];
  alerte: boolean;
  coursAlleges: DTOCoursTickerAllege[];

  constructor(date: Date, ticker: string, libelle: string, ouverture: number, plusHaut: number, plusBas: number,
              cloture: number, volume: number, moyennesMobiles: number[], alerte: boolean, coursAlleges: DTOCoursTickerAllege[]) {
    this.date = date;
    this.ticker = ticker;
    this.libelle = libelle;
    this.ouverture = ouverture;
    this.plusHaut = plusHaut;
    this.plusBas = plusBas;
    this.cloture = cloture;
    this.volume = volume;
    this.moyennesMobiles = moyennesMobiles;
    this.alerte = alerte;
    this.coursAlleges = coursAlleges;
  }

  public static fromDTOCours(date: Date, libelle: string, dto: DTOCours) {
    return new Cours(date, dto.ticker, libelle, dto.ouverture, dto.plusHaut, dto.plusBas, dto.cloture, dto.volume, dto.moyennesMobiles, dto.alerte, []);
  }

  public static fromDTOCoursTicker(ticker: string, libelle: string, dto: DTOCoursTicker, cours: DTOCoursTickerAllege[]) {
    return new Cours(dto.date, ticker, libelle, dto.ouverture, dto.plusHaut, dto.plusBas, dto.cloture, dto.volume, dto.moyennesMobiles, dto.alerte, cours);
  }

  public static fromCoursPortefeuille(dto: CoursPortefeuille) {
    return new Cours(dto.date, dto.ticker, dto.libelle, dto.ouverture, dto.plusHaut, dto.plusBas, dto.cloture, dto.volume, dto.moyennesMobiles, dto.alerte, dto.coursAlleges);
  }

  public classeIconeVariation(): string {
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
