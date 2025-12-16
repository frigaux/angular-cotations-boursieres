import {Component, input, InputSignal} from '@angular/core';
import {CoucheDenseComponent} from "../couches/couche-dense/couche-dense.component";
import {TranslatePipe} from "@ngx-translate/core";
import {Modele} from '../../../../services/modeles-tensor-flow/modele.interface';
import {ModeleService} from '../../../../services/modeles-tensor-flow/modele.service';
import {TypeCouche} from '../../../../services/modeles-tensor-flow/type-couche';
import {ModeleEtDonnees} from './modele-et-donnees.interface';

@Component({
  selector: 'app-explorateur-modele',
  imports: [
    CoucheDenseComponent,
    TranslatePipe
  ],
  templateUrl: './explorateur-modele.component.html',
  styleUrl: './explorateur-modele.component.sass',
})
export class ExplorateurModeleComponent {
  inputModeleEtDonnees: InputSignal<ModeleEtDonnees | undefined> = input(undefined,
    {transform: o => this.intercepteurModele(o), alias: 'modeleEtDonnees'});

  protected modele?: Modele;
  protected descriptionEntrees?: { sup: number; sub: number }[];
  protected entrees?: number[][];
  protected descriptionSorties?: { sup: number; sub: number }[];
  protected sorties?: number[][];

  constructor(private modeleService: ModeleService) {
  }

  private intercepteurModele(modeleEtDonnees: ModeleEtDonnees | undefined) {
    if (modeleEtDonnees) {
      this.modele = this.modeleService.modele(modeleEtDonnees.modele);

      this.descriptionEntrees = this.modele.couches[0].neurones[0].poids
        .map((poids, i) => {
          return {sup: 0, sub: i};
        });

      const derniereCouche = this.modele.couches[this.modele.couches.length - 1];
      this.descriptionSorties = derniereCouche.neurones
        .map((neurone, i) => {
          return {sup: derniereCouche.numero, sub: i};
        });

      this.entrees = modeleEtDonnees.donneesNormalisees.entrees.arraySync() as number[][];
      this.sorties = modeleEtDonnees.donneesNormalisees.sorties.arraySync() as number[][];
    }
    return modeleEtDonnees;
  }

  protected readonly TypeCouche = TypeCouche;
}
