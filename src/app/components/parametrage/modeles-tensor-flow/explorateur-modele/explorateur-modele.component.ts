import {Component, input, InputSignal} from '@angular/core';
import {CoucheDenseComponent} from "../couches/couche-dense/couche-dense.component";
import {TranslatePipe} from "@ngx-translate/core";
import {Modele} from '../../../../services/modeles-tensor-flow/modele.interface';
import {ModeleService} from '../../../../services/modeles-tensor-flow/modele.service';
import {TypeCouche} from '../../../../services/modeles-tensor-flow/type-couche';
import {ModeleEtDonnees} from './modele-et-donnees.interface';
import {ExplorateurEntreesSortiesComponent} from './explorateur-entrees-sorties/explorateur-entrees-sorties.component';

@Component({
  selector: 'app-explorateur-modele',
  imports: [
    CoucheDenseComponent,
    TranslatePipe,
    ExplorateurEntreesSortiesComponent
  ],
  templateUrl: './explorateur-modele.component.html',
  styleUrl: './explorateur-modele.component.sass',
})
export class ExplorateurModeleComponent {
  inputModeleEtDonnees: InputSignal<ModeleEtDonnees | undefined> = input(undefined,
    {transform: o => this.intercepteurModele(o), alias: 'modeleEtDonnees'});

  protected modele?: Modele;
  protected readonly TypeCouche = TypeCouche;
  protected modeleEtDonnees?: ModeleEtDonnees;

  constructor(private modeleService: ModeleService) {
  }

  private intercepteurModele(modeleEtDonnees: ModeleEtDonnees | undefined) {
    this.modeleEtDonnees = modeleEtDonnees;
    if (modeleEtDonnees) {
      this.modele = this.modeleService.modele(modeleEtDonnees.modele);
    }
    return modeleEtDonnees;
  }
}
