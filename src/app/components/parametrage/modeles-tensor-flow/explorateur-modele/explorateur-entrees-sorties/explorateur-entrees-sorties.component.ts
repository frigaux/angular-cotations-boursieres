import {Component, input, InputSignal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ModeleEtDonnees} from '../modele-et-donnees.interface';
import {ModeleService} from '../../../../../services/modeles-tensor-flow/modele.service';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-explorateur-entrees-sorties',
  imports: [
    TranslatePipe,
    DecimalPipe
  ],
  templateUrl: './explorateur-entrees-sorties.component.html',
  styleUrl: './explorateur-entrees-sorties.component.sass',
})
export class ExplorateurEntreesSortiesComponent {
  inputModeleEtDonnees: InputSignal<ModeleEtDonnees | undefined> = input(undefined,
    {transform: o => this.intercepteurModele(o), alias: 'modeleEtDonnees'});

  protected descriptionEntrees?: { sup: number; sub: number }[];
  protected entrees?: number[][];
  protected descriptionSorties?: { sup: number; sub: number }[];
  protected sorties?: number[][];

  constructor(private modeleService: ModeleService) {
  }

  private intercepteurModele(modeleEtDonnees: ModeleEtDonnees | undefined) {
    if (modeleEtDonnees) {
      const modele = this.modeleService.modele(modeleEtDonnees.modele);

      this.descriptionEntrees = modele.couches[0].neurones[0].poids
        .map((poids, i) => {
          return {sup: 0, sub: i};
        });

      const derniereCouche = modele.couches[modele.couches.length - 1];
      this.descriptionSorties = derniereCouche.neurones
        .map((neurone, i) => {
          return {sup: derniereCouche.numero, sub: i};
        });

      this.entrees = modeleEtDonnees.donneesNormalisees.entrees.arraySync() as number[][];
      this.sorties = modeleEtDonnees.donneesNormalisees.sorties.arraySync() as number[][];
    }
    return modeleEtDonnees;
  }
}
