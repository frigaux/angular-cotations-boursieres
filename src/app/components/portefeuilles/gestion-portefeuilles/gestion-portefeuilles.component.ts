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
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {EditeurAlertesComponent} from './editeur-alertes/editeur-alertes.component';
import {Alerte} from './alerte.interface';

// TODO : veille sur @Component et providers
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
    ImportExportComponent,
    ConfirmDialog,
    EditeurAlertesComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './gestion-portefeuilles.component.html',
  styleUrl: './gestion-portefeuilles.component.sass'
})
export class GestionPortefeuillesComponent implements OnInit {
  // chargement des cours
  loading: boolean = false;

  // données pour la vue
  portefeuilles: Array<Portefeuille> = [];
  portefeuilleNomEnModification: Portefeuille | undefined;
  portefeuilleValeursEnModification: Portefeuille | undefined;
  portefeuilleAlertesEnModification: Portefeuille | undefined;
  afficherCreation: boolean = false;

  constructor(private portefeuillesService: PortefeuillesService,
              private translateService: TranslateService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.portefeuilles = this.portefeuillesService.charger();
    this.portefeuillesService.onImport(portefeuilles => this.portefeuilles = portefeuilles);
  }

  tickers(portefeuille: Portefeuille) {
    if (portefeuille.tickers.length > 0) {
      return ': ' + portefeuille.tickers.reduce((t1, t2) => t1 + ', ' + t2);
    }
    return '(' + this.translateService.instant('COMPOSANTS.PORTEFEUILLES.GESTION_PORTEFEUILLES.PORTEFEUILLE_SANS_VALEUR') + ')';
  }

  creerPortefeuille(nom: string) {
    const parDefaut: boolean = this.portefeuilles.length === 0;
    this.portefeuilles.push({nom, parDefaut, tickers: [], alertes: []});
    this.portefeuillesService.enregistrer(this.portefeuilles);
  }

  modificationNomPortefeuille(idx: number) {
    this.portefeuilleNomEnModification = this.portefeuilles[idx];
  }

  modifierNomPortefeuille(nom: string) {
    this.portefeuilleNomEnModification!.nom = nom;
    this.portefeuilleNomEnModification = undefined;
    this.portefeuillesService.enregistrer(this.portefeuilles);
  }

  editionAlertesPortefeuille(idx: number) {
    this.portefeuilleAlertesEnModification = this.portefeuilles[idx];
  }

  editerAlertesPortefeuille(alertes: Alerte[]) {

  }

  associationValeursPortefeuille(idx: number) {
    this.portefeuilleValeursEnModification = this.portefeuilles[idx];
  }

  modifierValeursPortefeuille(tickers: string[]) {
    this.portefeuilleValeursEnModification!.tickers = tickers;
    this.portefeuillesService.enregistrer(this.portefeuilles);
    this.portefeuilleValeursEnModification = undefined;
  }

  suppressionPortefeuille(event: Event, idx: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.translateService.instant('COMPOSANTS.PORTEFEUILLES.GESTION_PORTEFEUILLES.CONFIRMATION_SUPPRESSION', {'nom': this.portefeuilles[idx].nom}),
      closable: false,
      closeOnEscape: true,
      rejectButtonProps: {
        label: this.translateService.instant('COMPOSANTS.COMMUN.ANNULER'),
        severity: 'warn'
      },
      acceptButtonProps: {
        label: this.translateService.instant('COMPOSANTS.COMMUN.SUPPRIMER'),
        severity: 'danger'
      },
      accept: () => {
        this.supprimerPortefeuille(idx);
      }
    });
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

  changerParDefaut(idx: number) {
    this.portefeuilles.forEach((portefeuille, index) => {
      portefeuille.parDefaut = index === idx;
    });
    this.portefeuillesService.enregistrer(this.portefeuilles);
  }
}
