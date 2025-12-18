import {Component, input, InputSignal} from '@angular/core';
import {CoucheDenseComponent} from "../couches/couche-dense/couche-dense.component";
import {TranslatePipe} from "@ngx-translate/core";
import {TypeCouche} from '../../../../services/modeles-tensor-flow/type-couche.enum';
import {ModeleEtDonnees} from './modele-et-donnees.interface';
import {ExplorateurEntreesSortiesComponent} from './explorateur-entrees-sorties/explorateur-entrees-sorties.component';
import {CoucheConv2dComponent} from '../couches/couche-conv2d/couche-conv2d.component';

@Component({
  selector: 'app-explorateur-modele',
  imports: [
    CoucheDenseComponent,
    TranslatePipe,
    ExplorateurEntreesSortiesComponent,
    CoucheConv2dComponent
  ],
  templateUrl: './explorateur-modele.component.html',
  styleUrl: './explorateur-modele.component.sass',
})
export class ExplorateurModeleComponent {
  inputModeleEtDonnees: InputSignal<ModeleEtDonnees | undefined> = input(undefined,
    {transform: o => this.intercepteurModele(o), alias: 'modeleEtDonnees'});

  protected readonly TypeCouche = TypeCouche;
  protected modeleEtDonnees?: ModeleEtDonnees;

  private intercepteurModele(modeleEtDonnees: ModeleEtDonnees | undefined) {
    this.modeleEtDonnees = modeleEtDonnees;
    return modeleEtDonnees;
  }
}
