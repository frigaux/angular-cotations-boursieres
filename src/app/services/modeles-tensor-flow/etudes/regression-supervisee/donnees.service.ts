import {Injectable} from '@angular/core';
import {IterateurDonnees} from './iterateur-donnees.class';
import {DonneesCoursVagues} from './donnees-cours-vagues.class';

@Injectable({
  providedIn: 'root',
})
export class DonneesService {
  public static readonly DONNEES_ENTRAINEMENT: number = 100;

  private static readonly URL_DONNEES_COURS_VAGUES: string =
    'http://fabienrigaux.freeboxos.fr/ml/cours_vagues_21_12_2025.json';

  async donneesCoursVagues(): Promise<IterateurDonnees> {
    const reponse = await fetch(DonneesService.URL_DONNEES_COURS_VAGUES);
    const donnees: Array<DonneesCoursVagues> = await reponse.json();
    return new Promise(resolve => {
      new IterateurDonnees(donnees);
    });
  }
}
