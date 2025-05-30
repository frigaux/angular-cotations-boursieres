import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {ProgressBar} from "primeng/progressbar";
import {ReactiveFormsModule} from '@angular/forms';
import {Card} from 'primeng/card';
import {TranslatePipe} from '@ngx-translate/core';
import {Portefeuille} from './portefeuille.interface';
import {SelecteurValeursComponent} from './selecteur-valeurs/selecteur-valeurs.component';
import {FormulaireCreationComponent} from './formulaire-creation/formulaire-creation.component';
import {FormulaireModificationComponent} from './formulaire-modification/formulaire-modification.component';

// TODO : composant de sauvegarde/restauration des portefeuilles
@Component({
  selector: 'app-gestion-portefeuilles',
  imports: [
    NgIf,
    ProgressBar,
    Card,
    ReactiveFormsModule,
    TranslatePipe,
    SelecteurValeursComponent,
    FormulaireCreationComponent,
    FormulaireModificationComponent
  ],
  templateUrl: './gestion-portefeuilles.component.html',
  styleUrl: './gestion-portefeuilles.component.sass'
})
export class GestionPortefeuillesComponent implements OnInit {
  private static readonly PORTEFEUILLES: string = 'portefeuilles';

  // chargement des cours
  loading: boolean = false;

  //données pour la vue
  portefeuilles: Array<Portefeuille> = [];
  portefeuilleEnModification: Portefeuille | undefined;
  portefeuilleEnEdition: Portefeuille | undefined;

  ngOnInit(): void {
    this.portefeuilles = [];
    const json = window.localStorage.getItem(GestionPortefeuillesComponent.PORTEFEUILLES);
    if (json) {
      this.portefeuilles = JSON.parse(json);
    }
  }

  tickers(portefeuille: Portefeuille) {
    if (portefeuille.tickers.length > 0) {
      return '(' + portefeuille.tickers.reduce((t1, t2) => t1 + ', ' + t2) + ')';
    }
    return '';
  }

  creerPortefeuille(nom: string) {
    this.portefeuilles.push({nom, tickers: []});
    this.setLocalStorage(this.portefeuilles);
  }

  modificationPortefeuille(idx: number) {
    this.portefeuilleEnModification = this.portefeuilles[idx];
  }

  modifierPortefeuille(nom: string) {
    this.portefeuilleEnModification!.nom = nom;
    this.portefeuilleEnModification = undefined;
    this.setLocalStorage(this.portefeuilles);
  }

  editionPortefeuille(idx: number) {
    this.portefeuilleEnEdition = this.portefeuilles[idx];
  }

  editerPortefeuille(tickers: string[]) {
    this.portefeuilleEnEdition!.tickers = tickers;
    this.setLocalStorage(this.portefeuilles);
    this.portefeuilleEnEdition = undefined;
  }

  supprimerPortefeuille(idx: number) {
    if (idx < this.portefeuilles.length) {
      this.portefeuilles.splice(idx, 1);
      this.setLocalStorage(this.portefeuilles);
    }
  }

  setLocalStorage(portefeuilles: Array<Portefeuille>) {
    window.localStorage.setItem(GestionPortefeuillesComponent.PORTEFEUILLES, JSON.stringify(portefeuilles));
  }
}
