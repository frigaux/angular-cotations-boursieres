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
import {ImportExportComponent} from './import-export/import-export.component';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';

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
    FormulaireModificationComponent,
    ImportExportComponent
  ],
  templateUrl: './gestion-portefeuilles.component.html',
  styleUrl: './gestion-portefeuilles.component.sass'
})
export class GestionPortefeuillesComponent implements OnInit {
  // chargement des cours
  loading: boolean = false;

  //données pour la vue
  portefeuilles: Array<Portefeuille> = [];
  portefeuilleEnModification: Portefeuille | undefined;
  portefeuilleEnEdition: Portefeuille | undefined;

  constructor(private portefeuillesService: PortefeuillesService) {
  }

  ngOnInit(): void {
    this.portefeuilles = this.portefeuillesService.charger();
    this.portefeuillesService.onImport(portefeuilles => this.portefeuilles = portefeuilles);
  }

  tickers(portefeuille: Portefeuille) {
    if (portefeuille.tickers.length > 0) {
      return '(' + portefeuille.tickers.reduce((t1, t2) => t1 + ', ' + t2) + ')';
    }
    return '';
  }

  creerPortefeuille(nom: string) {
    this.portefeuilles.push({nom, tickers: []});
    this.portefeuillesService.enregistrer(this.portefeuilles);
  }

  modificationPortefeuille(idx: number) {
    this.portefeuilleEnModification = this.portefeuilles[idx];
  }

  modifierPortefeuille(nom: string) {
    this.portefeuilleEnModification!.nom = nom;
    this.portefeuilleEnModification = undefined;
    this.portefeuillesService.enregistrer(this.portefeuilles);
  }

  editionPortefeuille(idx: number) {
    this.portefeuilleEnEdition = this.portefeuilles[idx];
  }

  editerPortefeuille(tickers: string[]) {
    this.portefeuilleEnEdition!.tickers = tickers;
    this.portefeuillesService.enregistrer(this.portefeuilles);
    this.portefeuilleEnEdition = undefined;
  }

  supprimerPortefeuille(idx: number) {
    if (idx < this.portefeuilles.length) {
      this.portefeuilles.splice(idx, 1);
      this.portefeuillesService.enregistrer(this.portefeuilles);
    }
  }
}
