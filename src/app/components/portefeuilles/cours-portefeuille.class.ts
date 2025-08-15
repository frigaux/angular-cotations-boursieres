import {DTOCoursAvecListeAllege} from '../../services/cours/dto-cours-avec-liste-allege.interface';
import {DTOCoursTickerAllege} from '../../services/cours/dto-cours-ticker-allege.interface';
import {Alerte} from './alerte.class';
import {DTOAlerte} from '../../services/portefeuilles/dto-alerte.interface';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {Marches} from '../../services/valeurs/marches.enum';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {DTOAchat} from '../../services/valeurs/dto-achat.interface';
import {ColonneDecoree} from './colonne-decoree.class';

export class CoursPortefeuille {
  date: string; // ISO 8601 : yyyy-MM-dd
  ticker: string;
  libelle: string;
  marche: Marches;
  ouverture: number;
  plusHaut: number;
  plusBas: number;
  cloture: number;
  volume: number;
  moyennesMobiles: number[];
  coursAlleges: DTOCoursTickerAllege[];
  alertes: { alerte: DTOAlerte, evaluer: Function }[];

  constructor(valeur: DTOValeur, dto: DTOCoursAvecListeAllege,
              alertes: { alerte: DTOAlerte, evaluer: Function }[],
              colonnesDecorees: ColonneDecoree[]) {
    this.date = dto.cours[0].date;
    this.ticker = dto.ticker;
    this.libelle = valeur.libelle;
    this.marche = valeur.marche;
    this.ouverture = dto.ouverture;
    this.plusHaut = dto.plusHaut;
    this.plusBas = dto.plusBas;
    this.cloture = dto.cloture;
    this.volume = dto.volume;
    this.moyennesMobiles = dto.moyennesMobiles;
    this.coursAlleges = dto.cours;
    this.alertes = alertes;

    Object.assign(this, {var1: this.calculerVariation(1)});

    for (const colonneDecoree of colonnesDecorees) {
      Object.assign(this, {[colonneDecoree.id]: colonneDecoree.evaluer(this)});
    }
  }

  public calculerVariation(jours: number) {
    if (this.coursAlleges.length > jours) {
      return (this.coursAlleges[0].cloture / this.coursAlleges[jours].cloture) - 1;
    } else {
      return undefined;
    }
  }

  evaluerAlertes(): Alerte[] {
    return this.alertes.map(dto =>
      new Alerte(dto.alerte, dto.evaluer(this.coursAlleges, this.moyennesMobiles))
    );
  }

  calculerVariationAchats(valeursService: ValeursService) {
    const achats: Array<DTOAchat> | undefined = valeursService.chargerAchatsTicker(this.ticker);
    if (!achats || achats.length === 0) {
      return undefined;
    }
    if (achats.length === 1) {
      return (this.cloture / achats[0].prix) - 1;
    }
    let totalQuantites = 0;
    let totalPrix = 0;
    for (const achat of achats) {
      totalQuantites += achat.quantite;
      totalPrix += achat.prix * achat.quantite;
    }
    return (this.cloture / (totalPrix / totalQuantites)) - 1;
  }
}
