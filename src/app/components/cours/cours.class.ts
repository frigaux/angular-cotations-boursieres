import {DTOCours} from '../../services/cours/dto-cours.interface';
import {DTOCoursTicker} from '../../services/cours/dto-cours-ticker.interface';
import {DTOCoursTickerAllege} from '../../services/cours/dto-cours-ticker-allege.interface';
import {CoursPortefeuille} from '../portefeuilles/cours-portefeuille.class';
import {DTODividende} from '../../services/dividendes/dto-dividende.interface';

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
  dividendes?: Array<DTODividende>;

  private constructor(date: string, ticker: string, libelle: string, ouverture: number, plusHaut: number, plusBas: number,
                      cloture: number, volume: number, moyennesMobiles: number[], coursAlleges: DTOCoursTickerAllege[], dividendes: Array<DTODividende>) {
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
    this.dividendes = dividendes;
  }

  public static fromDTOCours(date: string, libelle: string, dto: DTOCours, dividendes: Array<DTODividende>) {
    return new Cours(date, dto.ticker, libelle, dto.ouverture, dto.plusHaut, dto.plusBas, dto.cloture, dto.volume, dto.moyennesMobiles, [], dividendes);
  }

  public static fromDTOCoursTicker(ticker: string, libelle: string, dto: DTOCoursTicker, cours: DTOCoursTickerAllege[]) {
    return new Cours(dto.date, ticker, libelle, dto.ouverture, dto.plusHaut, dto.plusBas, dto.cloture, dto.volume, dto.moyennesMobiles, cours, []);
  }

  public static fromCoursPortefeuille(dto: CoursPortefeuille) {
    return new Cours(dto.date, dto.ticker, dto.libelle, dto.ouverture, dto.plusHaut, dto.plusBas, dto.cloture, dto.volume, dto.moyennesMobiles, dto.coursAlleges, []);
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

  public calculerMinimumMM(): number {
    return Math.min(...this.moyennesMobiles);
  }

  public calculerMaximumMM(): number {
    return Math.max(...this.moyennesMobiles);
  }

  public calculerMoyenneMM(): number {
    return this.moyennesMobiles
        .reduce((accumulator, mm) => accumulator + mm, 0)
      / this.moyennesMobiles.length;
  }
}
