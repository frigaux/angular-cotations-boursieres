import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {Card} from 'primeng/card';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DTOPortefeuille} from '../../../services/portefeuilles/dto-portefeuille.interface';
import {DialogSelecteurValeursComponent} from './dialog-selecteur-valeurs/dialog-selecteur-valeurs.component';
import {FormulaireCreationComponent} from './formulaire-creation/formulaire-creation.component';
import {
  DialogFormulaireModificationComponent
} from './dialog-formulaire-modification/dialog-formulaire-modification.component';
import {DialogImportExportComponent} from './dialog-import-export/dialog-import-export.component';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';
import {DialogEditeurAlertesComponent} from './dialog-editeur-alertes/dialog-editeur-alertes.component';
import {DTOAlerte} from '../../../services/portefeuilles/dto-alerte.interface';
import {ConfigurationPortefeuilleComponent} from './configuration-portefeuille/configuration-portefeuille.component';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {DialogueService} from '../../../services/dialogue/dialogue.service';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-gestion-portefeuilles',
  imports: [
    Card,
    ReactiveFormsModule,
    TranslatePipe,
    DialogSelecteurValeursComponent,
    FormulaireCreationComponent,
    DialogFormulaireModificationComponent,
    DialogImportExportComponent,
    DialogEditeurAlertesComponent,
    ConfigurationPortefeuilleComponent,
    CdkDropList,
    CdkDrag
  ],
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
              private confirmationService: ConfirmationService,
              private dialogueService: DialogueService) {
  }

  ngOnInit(): void {
    this.portefeuilles = this.portefeuillesService.charger();
    this.portefeuillesService.onImport(portefeuilles => this.portefeuilles = portefeuilles);
  }

  creerPortefeuille(parametres: { nom: string, initialiserAlertes: boolean }) {
    const premierParDefaut: boolean = this.portefeuilles.length === 0;
    let alertes: DTOAlerte[] = [];
    if (parametres.initialiserAlertes) {
      alertes = this.portefeuillesService.portefeuilleParDefaut()?.alertes || [];
    }
    this.portefeuilles.push({nom: parametres.nom, parDefaut: premierParDefaut, tickers: [], alertes});
    this.portefeuillesService.enregistrer(this.portefeuilles);
    this.afficherCreation = false;
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

  dropColonne(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.portefeuilles, event.previousIndex, event.currentIndex);
    this.portefeuillesService.enregistrer(this.portefeuilles);
  }

  suppressionPortefeuille(event: Event, idx: number) {
    this.dialogueService.confirmationSuppression(
      this.confirmationService,
      event,
      this.translateService.instant('COMPOSANTS.PORTEFEUILLES.GESTION_PORTEFEUILLES.CONFIRMATION_SUPPRESSION', {'nom': this.portefeuilles[idx].nom}),
      () => {
        this.supprimerPortefeuille(idx);
      }
    );
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
