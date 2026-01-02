import {Injectable} from '@angular/core';
import {
  PontDonneesCoursVagues as PontDonneesCoursVaguesRegression
} from './regression-supervisee/pont-donnees-cours-vagues.class';
import {
  PontDonneesCoursVagues as PontDonneesCoursVaguesClassification
} from './classification-supervisee/pont-donnees-cours-vagues.class';
import {DonneesCoursVagues} from './donnees-cours-vagues.class';

@Injectable({
  providedIn: 'root',
})
export class DonneesService {
  public static readonly DONNEES_ENTRAINEMENT: number = 100;

  private static readonly URL_DONNEES_COURS_VAGUES: string =
    'http://fabienrigaux.freeboxos.fr/ml/cours_vagues_02_01_2026.json';

  async donneesCoursVaguesRegression(): Promise<PontDonneesCoursVaguesRegression> {
    const reponse = await fetch(DonneesService.URL_DONNEES_COURS_VAGUES);
    const donnees: Array<DonneesCoursVagues> = await reponse.json();
    return new Promise(resolve =>
      resolve(new PontDonneesCoursVaguesRegression(donnees))
    );
  }

  async donneesCoursVaguesClassification(): Promise<PontDonneesCoursVaguesClassification> {
    const reponse = await fetch(DonneesService.URL_DONNEES_COURS_VAGUES);
    const donnees: Array<DonneesCoursVagues> = await reponse.json();
    return new Promise(resolve =>
      resolve(new PontDonneesCoursVaguesClassification(donnees))
    );
  }
}
