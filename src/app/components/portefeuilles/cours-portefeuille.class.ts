import {DtoCoursAvecListeAllege} from '../../services/cours/dto-cours-avec-liste-allege.interface';
import {DTOCoursTickerAllege} from '../../services/cours/dto-cours-ticker-allege.interface';

export class CoursPortefeuille {
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
  mm5: number | undefined;
  mm20: number | undefined;
  mm50: number | undefined;
  var1: number | undefined;
  var5: number | undefined;
  var20: number | undefined;
  var50: number | undefined;
  alertes: { nom: string; evaluation: boolean }[];

  constructor(private libelle_: string, private dto: DtoCoursAvecListeAllege,
              private alertes_: { nom: string; evaluer: Function }[]) {
    this.date = dto.cours[0].date;
    this.ticker = dto.ticker;
    this.libelle = libelle_;
    this.ouverture = dto.ouverture;
    this.plusHaut = dto.plusHaut;
    this.plusBas = dto.plusBas;
    this.cloture = dto.cloture;
    this.volume = dto.volume;
    this.moyennesMobiles = dto.moyennesMobiles;
    this.alerte = dto.alerte;
    this.coursAlleges = dto.cours;
    this.mm5 = dto.moyennesMobiles[4];
    this.mm20 = dto.moyennesMobiles[19];
    this.mm50 = dto.moyennesMobiles[49];
    this.var1 = this.calculerVariation(dto, 1);
    this.var5 = this.calculerVariation(dto, 5);
    this.var20 = this.calculerVariation(dto, 20);
    this.var50 = this.calculerVariation(dto, 50);
    this.alertes = this.evaluerAlertes(alertes_);
  }

  private calculerVariation(dto: DtoCoursAvecListeAllege, jours: number) {
    if (dto.cours.length > jours) {
      return (dto.cours[0].cloture / dto.cours[jours].cloture) - 1;
    } else {
      return undefined;
    }
  }

  private evaluerAlertes(alertes: { nom: string; evaluer: Function }[]):
    { nom: string; evaluation: boolean }[] {
    return alertes.map(alerte => {
        return {nom: alerte.nom, evaluation: alerte.evaluer(this.coursAlleges, this.moyennesMobiles)};
      }
    );
  }
}
