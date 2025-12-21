import {Component, input, InputSignal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ModeleEtDonnees} from '../modele-et-donnees.interface';
import {DecimalPipe} from '@angular/common';
import {TypeCouche} from '../../../../../services/modeles-tensor-flow/couches/type-couche.enum';
import {DTOCoucheDense} from '../../../../../services/modeles-tensor-flow/couches/dto-couche-dense.class';

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
      const premiereCouche = modeleEtDonnees.modele.couches[0];
      const derniereCouche = modeleEtDonnees.modele.couches[modeleEtDonnees.modele.couches.length - 1];
      if (modeleEtDonnees.entrees.shape.length === 3 && premiereCouche.type === TypeCouche.DENSE
      && derniereCouche.type === TypeCouche.DENSE) {
        const premiereDense = premiereCouche as DTOCoucheDense;
        this.descriptionEntrees = premiereDense.neurones[0].poids!
          .map((poids, i) => {
            return {sup: 0, sub: i};
          });

        const derniereDense = derniereCouche as DTOCoucheDense;
        this.descriptionSorties = derniereDense.neurones
          .map((neurone, i) => {
            return {sup: derniereDense.numero, sub: i};
          });

        this.entrees = modeleEtDonnees.entrees.arraySync() as number[][];
        this.sorties = modeleEtDonnees.sorties.arraySync() as number[][];
      }
    }
    return modeleEtDonnees;
  }
}
