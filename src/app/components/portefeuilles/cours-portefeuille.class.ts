import {DTOCoursAvecListeAllege} from '../../services/cours/dto-cours-avec-liste-allege.interface';
import {DTOCoursTickerAllege} from '../../services/cours/dto-cours-ticker-allege.interface';
import {AlerteAvecSonEvaluation} from './alerte-avec-son-evaluation.class';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {Marches} from '../../services/valeurs/marches.enum';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {DTOAchat} from '../../services/valeurs/dto-achat.interface';
import {ColonneDecoree} from './colonne-decoree.class';
import {DividendesService} from '../../services/dividendes/dividendes.service';
import {AlertesDecorees} from './alertes-decorees.interface';

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
  alertes: AlertesDecorees;
  coursMinimum?: number;
  coursMaximum?: number;
  coursMoyen?: number;
  coursNbVagues?: number;

  constructor(valeur: DTOValeur, dto: DTOCoursAvecListeAllege,
              alertes: AlertesDecorees,
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
    if (alertes.avecOperandeMIN) {
      this.coursMinimum = Math.min(...this.coursAlleges.map(cours => cours.cloture));
    }
    if (alertes.avecOperandeMAX) {
      this.coursMaximum = Math.max(...this.coursAlleges.map(cours => cours.cloture));
    }
    if (alertes.avecOperandeMOY) {
      this.coursMoyen = this.coursAlleges
          .reduce((accumulator, cours) => accumulator + cours.cloture, 0)
        / this.coursAlleges.length;
    }
    if (alertes.avecOperandeNBV) {
      this.coursNbVagues = this.estimerNbVagues();
    }

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

  public trouverDividendes(dividendesService: DividendesService) {
    return dividendesService.charger()?.dividendes
      .filter(dividende => dividende.ticker === this.ticker);
  }

  evaluerAlertes(): AlerteAvecSonEvaluation[] {
    return this.alertes.alertesDecorees.map((dto, id) =>
      new AlerteAvecSonEvaluation(id, dto.alerte,
        dto.evaluer(this.coursAlleges, this.moyennesMobiles, this.coursMinimum, this.coursMaximum, this.coursMoyen, this.coursNbVagues))
    );
  }

  calculerVariationAchats(valeursService: ValeursService) {
    const achats: Array<DTOAchat> | undefined = valeursService.chargerAchatsTicker(this.ticker)
      .filter(achat => achat.dateRevente === undefined);
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

  private estimerNbVagues() {
    if (this.coursAlleges.length > 100) {
      const nbJoursMM = 15;
      const moyennesMobilesGlissantes = this.calculerMoyennesMobilesGlissantes(nbJoursMM);
      return this.calculerNbVagues(moyennesMobilesGlissantes, nbJoursMM);
    }
    return 0;
  }

  private calculerNbVagues(moyennesMobilesGlissantes: Array<number>, nbJours: number) {
    let auDessus: boolean | undefined = undefined;
    let nbVagues = 0;
    moyennesMobilesGlissantes.forEach((moyenneMobileGlissante, i) => {
      if (moyenneMobileGlissante > this.moyennesMobiles[i + nbJours - 1]) {
        if (auDessus !== undefined && !auDessus) {
          nbVagues++;
        }
        auDessus = true;
      } else {
        if (auDessus !== undefined && auDessus) {
          nbVagues++;
        }
        auDessus = false;
      }
    });
    return nbVagues;
  }

  private calculerMoyennesMobilesGlissantes(nbJours: number) {
    const moyennesMobiles: Array<number> = [];
    let somme = 0;
    for (let i = 0; i < nbJours; i++) {
      somme += this.coursAlleges[i].cloture;
    }
    moyennesMobiles.push(somme / nbJours);
    for (let j = nbJours; j < this.coursAlleges.length; j++) {
      somme = somme - this.coursAlleges[j - nbJours].cloture + this.coursAlleges[j].cloture;
      moyennesMobiles.push(somme / nbJours);
    }
    return moyennesMobiles;
  }
}
