import {DTOCoursTickerAllege} from '../cours/dto-cours-ticker-allege.interface';

export class IndicateursUtil {
  public static calculerPourcentageEcartType(coursAlleges: DTOCoursTickerAllege[]) {
    if (coursAlleges.length !== 0) {
      const moyenne =
        coursAlleges.reduce((accumulator, cours) => accumulator + cours.cloture, 0)
        / coursAlleges.length;
      const variance =
        coursAlleges.reduce((accumulator, cours) => accumulator + Math.pow(cours.cloture - moyenne, 2), 0)
        / coursAlleges.length;
      return Math.sqrt(variance) / moyenne;
    } else {
      return 0;
    }
  }

  public static estimerNbVagues(coursAlleges: DTOCoursTickerAllege[], moyennesMobiles: number[], nbJours: number) {
    if (coursAlleges.length > 100 && nbJours <= coursAlleges.length) {
      const nbJoursMM = 15;
      const moyennesMobilesGlissantes = this.calculerMoyennesMobilesGlissantes(coursAlleges, nbJours, nbJoursMM);
      return this.calculerNbVagues(moyennesMobiles, moyennesMobilesGlissantes, nbJoursMM);
    }
    return 0;
  }

  private static calculerNbVagues(moyennesMobiles: number[], moyennesMobilesGlissantes: Array<number>, nbJoursMM: number) {
    let auDessus: boolean | undefined = undefined;
    let nbVagues = 0;
    moyennesMobilesGlissantes.forEach((moyenneMobileGlissante, i) => {
      if (moyenneMobileGlissante > moyennesMobiles[i + nbJoursMM - 1]) {
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

  private static calculerMoyennesMobilesGlissantes(coursAlleges: DTOCoursTickerAllege[], nbJours: number, nbJoursMM: number) {
    const moyennesMobiles: Array<number> = [];
    let somme = 0;
    for (let i = 0; i < nbJoursMM; i++) {
      somme += coursAlleges[i].cloture;
    }
    moyennesMobiles.push(somme / nbJoursMM);
    for (let j = nbJoursMM; j < nbJours; j++) {
      somme = somme - coursAlleges[j - nbJoursMM].cloture + coursAlleges[j].cloture;
      moyennesMobiles.push(somme / nbJoursMM);
    }
    return moyennesMobiles;
  }
}
