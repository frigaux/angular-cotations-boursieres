import {Component, input, InputSignal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ModeleEtDonnees} from '../modele-et-donnees.interface';
import {DecimalPipe} from '@angular/common';
import {TypeCouche} from '../../../../../services/modeles-tensor-flow/type-couche';

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

  private intercepteurModele(modeleEtDonnees: ModeleEtDonnees | undefined) {
    if (modeleEtDonnees) {
      if (modeleEtDonnees.entrees.shape.length === 3 && modeleEtDonnees.modele.couches[0].type === TypeCouche.DENSE) {
        this.descriptionEntrees = modeleEtDonnees.modele.couches[0].neurones[0].poids!
          .map((poids, i) => {
            return {sup: 0, sub: i};
          });

        const derniereCouche = modeleEtDonnees.modele.couches[modeleEtDonnees.modele.couches.length - 1];
        this.descriptionSorties = derniereCouche.neurones
          .map((neurone, i) => {
            return {sup: derniereCouche.numero, sub: i};
          });

        this.entrees = modeleEtDonnees.entrees.arraySync() as number[][];
        this.sorties = modeleEtDonnees.sorties.arraySync() as number[][];
      }
    }
    return modeleEtDonnees;
  }
}
