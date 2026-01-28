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
import {EtapeValeurUtil} from '../valeurs/achats-valeur/etape-valeur-util.class';
import {EtapeValeur} from '../valeurs/achats-valeur/etape-valeur.enum';

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
  coursMinimum?: (nbJours: number) => number;
  coursMaximum?: (nbJours: number) => number;
  coursMoyen?: (nbJours: number) => number;
  coursNbVagues?: (nbJours: number) => number;

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
      this.coursMinimum = (nbJours: number) => {
        const nb = Math.min(nbJours, this.coursAlleges.length);
        return Math.min(...this.coursAlleges.slice(0, nb).map(cours => cours.cloture));
      };
    }
    if (alertes.avecOperandeMAX) {
      this.coursMaximum = (nbJours: number) => {
        const nb = Math.min(nbJours, this.coursAlleges.length);
        return Math.max(...this.coursAlleges.slice(0, nb).map(cours => cours.cloture));
      };
    }
    if (alertes.avecOperandeMOY) {
      this.coursMoyen = (nbJours: number) => {
        const nb = Math.min(nbJours, this.coursAlleges.length);
        return this.coursAlleges.slice(0, nb)
            .reduce((accumulator, cours) => accumulator + cours.cloture, 0)
          / nb;
      };
    }
    if (alertes.avecOperandeNBV) {
      this.coursNbVagues = (nbJours: number) => this.estimerNbVagues(nbJours);
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

  /**
   *
   * @param valeursService
   * @param etapeValeur défini si portefeuille ajouté (OA, A, OV)
   */
  calculerVariationAchats(valeursService: ValeursService, etapeValeur?: EtapeValeur) {
    const achats: Array<DTOAchat> | undefined = valeursService.chargerAchatsTicker(this.ticker)
      .filter(achat => {
        if (etapeValeur !== undefined) {
          if (etapeValeur === EtapeValeur.ORDRE_ACHAT) {
            return EtapeValeurUtil.isOrdreAchat(achat);
          } else if (etapeValeur === EtapeValeur.ORDRE_VENTE) {
            return EtapeValeurUtil.isOrdreVente(achat);
          }
        }
        return EtapeValeurUtil.isAchat(achat);
      });

    if (!achats || achats.length === 0) {
      return undefined;
    }
    if (achats.length === 1) {
      if (etapeValeur === EtapeValeur.ORDRE_ACHAT) {
        return (achats[0].prix! / this.cloture) - 1;
      }
      if (etapeValeur === EtapeValeur.ORDRE_VENTE) {
        return (this.cloture / achats[0].prixRevente!) - 1;
      }
      return (this.cloture / achats[0].prix) - 1;
    }
    let totalQuantites = 0;
    let totalPrix = 0;
    for (const achat of achats) {
      totalQuantites += achat.quantite;
      if (etapeValeur === EtapeValeur.ORDRE_VENTE) {
        totalPrix += achat.prixRevente! * achat.quantite;
      } else {
        totalPrix += achat.prix * achat.quantite;
      }
    }

    if (etapeValeur === EtapeValeur.ORDRE_ACHAT) {
      return ((totalPrix / totalQuantites) / this.cloture) - 1;
    }
    return (this.cloture / (totalPrix / totalQuantites)) - 1;
  }

  private estimerNbVagues(nbJours: number) {
    if (this.coursAlleges.length > 100 && nbJours <= this.coursAlleges.length) {
      const nbJoursMM = 15;
      const moyennesMobilesGlissantes = this.calculerMoyennesMobilesGlissantes(nbJours, nbJoursMM);
      return this.calculerNbVagues(moyennesMobilesGlissantes, nbJoursMM);
    }
    return 0;
  }

  private calculerNbVagues(moyennesMobilesGlissantes: Array<number>, nbJoursMM: number) {
    let auDessus: boolean | undefined = undefined;
    let nbVagues = 0;
    moyennesMobilesGlissantes.forEach((moyenneMobileGlissante, i) => {
      if (moyenneMobileGlissante > this.moyennesMobiles[i + nbJoursMM - 1]) {
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

  private calculerMoyennesMobilesGlissantes(nbJours: number, nbJoursMM: number) {
    const moyennesMobiles: Array<number> = [];
    let somme = 0;
    for (let i = 0; i < nbJoursMM; i++) {
      somme += this.coursAlleges[i].cloture;
    }
    moyennesMobiles.push(somme / nbJoursMM);
    for (let j = nbJoursMM; j < nbJours; j++) {
      somme = somme - this.coursAlleges[j - nbJoursMM].cloture + this.coursAlleges[j].cloture;
      moyennesMobiles.push(somme / nbJoursMM);
    }
    return moyennesMobiles;
  }
}
