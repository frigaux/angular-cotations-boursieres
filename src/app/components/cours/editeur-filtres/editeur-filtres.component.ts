import {Component, inject, input, InputSignal, output} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {FloatLabel} from 'primeng/floatlabel';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NgForOf, NgIf} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {DialogueService} from '../../../services/dialogue/dialogue.service';
import {AutoFocus} from 'primeng/autofocus';
import {EditeurConditionFiltreComponent} from './editeur-condition-filtre/editeur-condition-filtre.component';
import {DTOFiltre} from '../../../services/cours/dto-filtre.interface';
import {CoursService} from '../../../services/cours/cours.service';

// TOOD : import export
@Component({
  selector: 'app-editeur-filtres',
  imports: [
    Button,
    Dialog,
    FloatLabel,
    FormsModule,
    InputText,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    AutoFocus,
    EditeurConditionFiltreComponent
  ],
  templateUrl: './editeur-filtres.component.html',
  styleUrls: ['../../portefeuilles/gestion-portefeuilles/editeur-alertes/editeur-alertes.component.sass', './editeur-filtres.component.sass']
})
export class EditeurFiltresComponent {
  private formBuilder = inject(FormBuilder);

  // input/output
  // visible = model<boolean>(false);
  inputVisible: InputSignal<boolean | undefined> = input(false,
    {transform: o => this.intercepteurVisible(o), alias: 'visible'});
  visibleChange = output<boolean>();

  // données pour la vue
  visible: boolean = false;
  filtres: DTOFiltre[] = [];
  filtreEnModification: DTOFiltre | undefined;

  // formulaire
  noms: FormArray<FormControl<unknown>> = this.formBuilder.array([]);
  formulaire = new FormGroup({
    noms: this.noms
  });

  constructor(private translateService: TranslateService,
              private coursService: CoursService,
              private confirmationService: ConfirmationService,
              private dialogueService: DialogueService) {
  }

  private intercepteurVisible(visible: boolean | undefined) {
    this.visible = visible ? visible : false;
    if (this.visible) {
      this.filtres = this.coursService.chargerFiltres();
      this.noms.clear();
      this.filtres.forEach(filtre => this.noms.push(this.formBuilder.control(filtre.nom, [Validators.required])));
    }
    return visible;
  }

  ajouterFiltre() {
    this.filtres.push({nom: '', condition: ''});
    this.noms.push(this.formBuilder.control('', [Validators.required]));
  }

  editionFiltre(idx: number) {
    this.filtreEnModification = this.filtres[idx];
  }

  modifierConditionFiltre(condition: string) {
    this.filtreEnModification!.condition = condition;
    this.filtreEnModification = undefined;
  }

  suppressionFiltre(event: Event, idx: number) {
    this.dialogueService.confirmationSuppression(
      this.confirmationService,
      event,
      this.translateService.instant('COMPOSANTS.COURS.EDITEUR_FILTRES.CONFIRMATION_SUPPRESSION', {'nom': this.noms.at(idx).value}),
      () => {
        this.supprimerFiltre(idx);
      }
    );
  }

  supprimerFiltre(idx: number) {
    if (idx < this.filtres.length) {
      this.filtres.splice(idx, 1);
      this.noms.removeAt(idx);
    }
  }

  modifierFiltresPortefeuille() {
    // TODO : validation des alertes
    this.filtres.forEach((alerte, index) => {
      alerte.nom = this.noms.at(index).value as string;
    });
    this.coursService.enregistrerFiltres(this.filtres);
    this.visible = false;
    this.visibleChange.emit(false);
  }

  abandonner() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
