import {Component, input, InputSignal} from '@angular/core';
import {CoucheDenseComponent} from "./couches/couche-dense/couche-dense.component";
import {TranslatePipe} from "@ngx-translate/core";
import {TypeCouche} from '../../../../../services/modeles-tensor-flow/commun/couches/type-couche.enum';
import {ModeleEtDonnees} from './modele-et-donnees.interface';
import {ExplorateurEntreesSortiesComponent} from './explorateur-entrees-sorties/explorateur-entrees-sorties.component';
import {CoucheConv2dComponent} from './couches/couche-conv2d/couche-conv2d.component';
import {CoucheMaxpooling2dComponent} from './couches/couche-maxpooling2d/couche-maxpooling2d.component';
import {CoucheFlatten} from './couches/couche-flatten/couche-flatten';
import {CoucheReshape} from './couches/couche-reshape/couche-reshape';
import {CoucheConv1dComponent} from './couches/couche-conv1d/couche-conv1d.component';
import {CoucheMaxpooling1dComponent} from './couches/couche-maxpooling1d/couche-maxpooling1d.component';

@Component({
  selector: 'app-explorateur-modele',
  imports: [
    CoucheDenseComponent,
    TranslatePipe,
    ExplorateurEntreesSortiesComponent,
    CoucheConv2dComponent,
    CoucheMaxpooling2dComponent,
    CoucheFlatten,
    CoucheReshape,
    CoucheConv1dComponent,
    CoucheMaxpooling1dComponent
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
