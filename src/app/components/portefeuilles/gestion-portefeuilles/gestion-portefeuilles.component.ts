import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {ProgressBar} from "primeng/progressbar";
import {ReactiveFormsModule} from '@angular/forms';
import {Card} from 'primeng/card';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Portefeuille} from './portefeuille.interface';
import {SelecteurValeursComponent} from './selecteur-valeurs/selecteur-valeurs.component';
import {FormulaireCreationComponent} from './formulaire-creation/formulaire-creation.component';
import {FormulaireModificationComponent} from './formulaire-modification/formulaire-modification.component';
import {ImportExportComponent} from './import-export/import-export.component';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';

// TODO : boite de dialogue pour sélecteur de valeurs
// TODO : boite de confirmation de suppression
// TODO : boite de dialogue pour la configuration des alertes du portefeuille
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

  // données pour la vue
  portefeuilles: Array<Portefeuille> = [];
  portefeuilleEnModification: Portefeuille | undefined;
  portefeuilleValeursEnModification: Portefeuille | undefined;
  afficherCreation: boolean = false;

  constructor(private portefeuillesService: PortefeuillesService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.portefeuilles = this.portefeuillesService.charger();
    this.portefeuillesService.onImport(portefeuilles => this.portefeuilles = portefeuilles);
  }

  tickers(portefeuille: Portefeuille) {
    if (portefeuille.tickers.length > 0) {
      return ': ' + portefeuille.tickers.reduce((t1, t2) => t1 + ', ' + t2);
    }
    return '(' + this.translateService.instant('COMPOSANTS.PORTEFEUILLES.GESTION_PORTEFEUILLES.PORTEFEUILLE_SANS_VALEUR') +')';
  }

  creerPortefeuille(nom: string) {
    const parDefaut: boolean = this.portefeuilles.length === 0;
    this.portefeuilles.push({nom, parDefaut, tickers: []});
    this.portefeuillesService.enregistrer(this.portefeuilles);
  }

  modificationNomPortefeuille(idx: number) {
    this.portefeuilleEnModification = this.portefeuilles[idx];
  }

  modifierNomPortefeuille(nom: string) {
    this.portefeuilleEnModification!.nom = nom;
    this.portefeuilleEnModification = undefined;
    this.portefeuillesService.enregistrer(this.portefeuilles);
  }

  modificationValeursPortefeuille(idx: number) {
    this.portefeuilleValeursEnModification = this.portefeuilles[idx];
  }

  modifierValeursPortefeuille(tickers: string[]) {
    this.portefeuilleValeursEnModification!.tickers = tickers;
    this.portefeuillesService.enregistrer(this.portefeuilles);
    this.portefeuilleValeursEnModification = undefined;
  }

  supprimerPortefeuille(idx: number) {
    if (idx < this.portefeuilles.length) {
      const parDefaut = this.portefeuilles[idx].parDefaut;
      this.portefeuilles.splice(idx, 1);
      if (parDefaut && this.portefeuilles.length > 0) {
        this.portefeuilles[0].parDefaut = true;
      }
      this.portefeuillesService.enregistrer(this.portefeuilles);
    }
  }

  onChangeParDefaut(e: any) {
    this.portefeuilles.forEach((portefeuille, index) => {
      portefeuille.parDefaut = index === Number(e.target.value);
    });
    this.portefeuillesService.enregistrer(this.portefeuilles);
  }
}
