import {Component, inject, input, InputSignal, output} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DTOPortefeuille} from '../../../../services/portefeuilles/dto-portefeuille.interface';
import {DTOAlerte} from '../../../../services/portefeuilles/dto-alerte.interface';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EditeurConditionAlerteComponent} from './editeur-condition-alerte/editeur-condition-alerte.component';
import {DialogueService} from '../../../../services/dialogue/dialogue.service';
import {ConfirmationService} from 'primeng/api';
import {PortefeuillesService} from '../../../../services/portefeuilles/portefeuilles.service';

@Component({
  selector: 'app-editeur-alertes',
  imports: [
    Dialog,
    Button,
    TranslatePipe,
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    EditeurConditionAlerteComponent
  ],
  templateUrl: './editeur-alertes.component.html',
  styleUrl: './editeur-alertes.component.sass'
})
export class EditeurAlertesComponent {
  private formBuilder = inject(FormBuilder);

  // input/output
  portefeuille: InputSignal<DTOPortefeuille | undefined> = input(undefined,
    {transform: o => this.intercepteurPortefeuille(o)});
  modifie = output<DTOAlerte[]>();
  abandon = output<void>();

  // données pour la vue
  portefeuilleEnModification: DTOPortefeuille | undefined;
  titre?: string;
  alertes: DTOAlerte[] = [];
  alerteEnModification: DTOAlerte | undefined;
  erreur?: string;

  // formulaire
  noms: FormArray<FormControl<unknown>> = this.formBuilder.array([]);
  formulaire: FormGroup = this.formBuilder.group({
    noms: this.noms
  });

  constructor(private translateService: TranslateService,
              private confirmationService: ConfirmationService,
              private dialogueService: DialogueService,
              private portefeuillesService: PortefeuillesService) {
  }

  private intercepteurPortefeuille(portefeuille: DTOPortefeuille | undefined) {
    this.portefeuilleEnModification = portefeuille;
    if (this.portefeuilleEnModification) {
      this.titre = this.translateService.instant('COMPOSANTS.PORTEFEUILLES.GESTION_PORTEFEUILLES.EDITEUR_ALERTES.MODIFICATION_PORTEFEUILLE', {'nom': this.portefeuilleEnModification.nom});
      this.alertes = JSON.parse(JSON.stringify(this.portefeuilleEnModification.alertes));
      this.noms.clear();
      this.alertes.forEach(alerte => this.noms.push(this.formBuilder.control(alerte.nom, [Validators.required])));
    }
    return portefeuille;
  }

  ajouterAlerte() {
    this.alertes.push({nom: '', condition: ''});
    this.noms.push(this.formBuilder.control('', [Validators.required]));
  }

  editionAlerte(idx: number) {
    this.alerteEnModification = this.alertes[idx];
  }

  modifierConditionAlerte(condition: string) {
    this.alerteEnModification!.condition = condition;
    this.alerteEnModification = undefined;
  }

  suppressionAlerte(event: Event, idx: number) {
    this.dialogueService.confirmationSuppression(
      this.confirmationService,
      event,
      this.translateService.instant('COMPOSANTS.PORTEFEUILLES.GESTION_PORTEFEUILLES.EDITEUR_ALERTES.CONFIRMATION_SUPPRESSION', {'nom': this.noms.at(idx).value}),
      () => {
        this.supprimerAlerte(idx);
      }
    );
  }

  supprimerAlerte(idx: number) {
    if (idx < this.alertes.length) {
      this.alertes.splice(idx, 1);
      this.noms.removeAt(idx);
    }
  }

  modifierAlertesPortefeuille() {
    this.alertes.forEach((alerte, index) => {
      alerte.nom = this.noms.at(index).value as string;
    });
    this.erreur = this.portefeuillesService.validerAlertes(this.alertes);
    if (this.erreur === undefined) {
      this.modifie.emit(this.alertes);
    }
  }
}
