import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {ReactiveFormsModule} from '@angular/forms';
import {Card} from 'primeng/card';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DTOPortefeuille} from './dto-portefeuille.interface';
import {SelecteurValeursComponent} from './selecteur-valeurs/selecteur-valeurs.component';
import {FormulaireCreationComponent} from './formulaire-creation/formulaire-creation.component';
import {FormulaireModificationComponent} from './formulaire-modification/formulaire-modification.component';
import {ImportExportComponent} from './import-export/import-export.component';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';
import {ConfirmationService} from 'primeng/api';
import {EditeurAlertesComponent} from './editeur-alertes/editeur-alertes.component';
import {DTOAlerte} from './dto-alerte.interface';
import {PortefeuilleComponent} from './portefeuille/portefeuille.component';

@Component({
  selector: 'app-gestion-portefeuilles',
  imports: [
    NgIf,
    Card,
    ReactiveFormsModule,
    TranslatePipe,
    SelecteurValeursComponent,
    FormulaireCreationComponent,
    FormulaireModificationComponent,
    ImportExportComponent,
    EditeurAlertesComponent,
    PortefeuilleComponent
  ],
  // providers: [ConfirmationService],
  templateUrl: './gestion-portefeuilles.component.html',
  styleUrl: './gestion-portefeuilles.component.sass'
})
export class GestionPortefeuillesComponent implements OnInit {
  // données pour la vue
  portefeuilles: Array<DTOPortefeuille> = [];
  portefeuilleNomEnModification: DTOPortefeuille | undefined;
  portefeuilleValeursEnModification: DTOPortefeuille | undefined;
  portefeuilleAlertesEnModification: DTOPortefeuille | undefined;
  afficherCreation: boolean = false;

  constructor(private portefeuillesService: PortefeuillesService,
              private translateService: TranslateService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.portefeuilles = this.portefeuillesService.charger();
    this.portefeuillesService.onImport(portefeuilles => this.portefeuilles = portefeuilles);
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

  modifierAlertesPortefeuille(alertes: DTOAlerte[]) {
    this.portefeuilleAlertesEnModification!.alertes = alertes;
    this.portefeuilleAlertesEnModification = undefined;
    this.portefeuillesService.enregistrer(this.portefeuilles);
  }

  associationValeursPortefeuille(idx: number) {
    this.portefeuilleValeursEnModification = this.portefeuilles[idx];
  }

  modifierValeursPortefeuille(tickers: string[]) {
    this.portefeuilleValeursEnModification!.tickers = tickers;
    this.portefeuillesService.enregistrer(this.portefeuilles);
    this.portefeuilleValeursEnModification = undefined;
  }

  monterPortefeuille(idx: number) {
    [this.portefeuilles[idx], this.portefeuilles[idx - 1]] = [this.portefeuilles[idx - 1], this.portefeuilles[idx]];
    this.portefeuillesService.enregistrer(this.portefeuilles);
  }

  descendrePortefeuille(idx: number) {
    [this.portefeuilles[idx], this.portefeuilles[idx + 1]] = [this.portefeuilles[idx + 1], this.portefeuilles[idx]];
    this.portefeuillesService.enregistrer(this.portefeuilles);
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
