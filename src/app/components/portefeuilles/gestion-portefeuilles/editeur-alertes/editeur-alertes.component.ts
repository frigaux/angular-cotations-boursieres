import {Component, inject, input, InputSignal, output} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Portefeuille} from '../portefeuille.interface';
import {Alerte} from '../alerte.interface';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AutoFocus} from 'primeng/autofocus';
import {ConfirmationService} from 'primeng/api';
import {NgForOf} from '@angular/common';
import {EditeurConditionAlerteComponent} from './editeur-condition-alerte/editeur-condition-alerte.component';

@Component({
  selector: 'app-editeur-alertes',
  imports: [
    Dialog,
    Button,
    TranslatePipe,
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    AutoFocus,
    NgForOf,
    EditeurConditionAlerteComponent
  ],
  // providers: [ConfirmationService],
  templateUrl: './editeur-alertes.component.html',
  styleUrl: './editeur-alertes.component.sass'
})
export class EditeurAlertesComponent {
  private formBuilder = inject(FormBuilder);

  // input/output
  portefeuille: InputSignal<Portefeuille | undefined> = input(undefined,
    {transform: o => this.intercepteurPortefeuille(o)});
  modifie = output<Alerte[]>();
  abandon = output<void>();

  // données pour la vue
  portefeuilleEnModification: Portefeuille | undefined;
  titre: string | undefined;
  alertes: Alerte[] = [];
  alerteEnModification: Alerte | undefined;

  // formulaire
  noms: FormArray<FormControl<unknown>> = this.formBuilder.array([]);
  formulaire = new FormGroup({
    noms: this.noms
  });

  constructor(private translateService: TranslateService,
              private confirmationService: ConfirmationService) {
  }

  private intercepteurPortefeuille(portefeuille: Portefeuille | undefined) {
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

  editionAlertes(idx: number) {
    this.alerteEnModification = this.alertes[idx];
  }

  suppressionAlerte(event: Event, idx: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.translateService.instant('COMPOSANTS.PORTEFEUILLES.GESTION_PORTEFEUILLES.EDITEUR_ALERTES.CONFIRMATION_SUPPRESSION', {'nom': this.noms.at(idx).value}),
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
        this.supprimerAlerte(idx);
      }
    });
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
    this.modifie.emit(this.alertes);
  }

  modifierConditionAlerte(condition: string) {
    this.alerteEnModification!.condition = condition;
    this.alerteEnModification = undefined;
  }
}
