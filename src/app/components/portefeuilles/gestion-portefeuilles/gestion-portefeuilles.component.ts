import {Component, inject, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {ProgressBar} from "primeng/progressbar";
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {pasDeNomEnDoublonValidator} from './pas-de-nom-en-doublon.validator';
import {TranslatePipe} from '@ngx-translate/core';
import {Portefeuille} from './portefeuille.interface';

@Component({
  selector: 'app-gestion-portefeuilles',
  imports: [
    NgIf,
    ProgressBar,
    FloatLabel,
    InputText,
    Button,
    Card,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './gestion-portefeuilles.component.html',
  styleUrl: './gestion-portefeuilles.component.sass'
})
export class GestionPortefeuillesComponent implements OnInit {
  private static readonly PORTEFEUILLES: string = 'portefeuilles';

  // injections
  private formBuilder = inject(FormBuilder);

  // chargement des cours
  loading: boolean = false;

  // formulaires
  formulaireCreationPortefeuille = this.formBuilder.group({
    champNom: ['', [Validators.required]]
  });
  formulaireModificationPortefeuille = this.formBuilder.group({
    champNom: ['', [Validators.required]]
  });

  //données pour la vue
  portefeuilles: Array<Portefeuille> = [];
  portefeuilleEnRenommage: Portefeuille | undefined;

  ngOnInit(): void {
    this.portefeuilles = [];
    const json = window.localStorage.getItem(GestionPortefeuillesComponent.PORTEFEUILLES);
    if (json) {
      this.portefeuilles = JSON.parse(json);
    }
    this.formulaireCreationPortefeuille.get('champNom')?.addValidators(pasDeNomEnDoublonValidator(this.portefeuilles))
    this.formulaireModificationPortefeuille.get('champNom')?.addValidators(pasDeNomEnDoublonValidator(this.portefeuilles))
  }

  creerPortefeuille() {
    // au second submit du même nom, il faut s'assurer que l'on ne crée pas un doublon
    this.formulaireCreationPortefeuille.get('champNom')?.updateValueAndValidity();
    if (this.formulaireCreationPortefeuille.valid && this.formulaireCreationPortefeuille.value.champNom) {
      this.portefeuilles.push({nom: this.formulaireCreationPortefeuille.value.champNom, tickers: []});
      this.setLocalStorage();
    }
  }

  renommagePortefeuille() {
    this.formulaireModificationPortefeuille.get('champNom')?.updateValueAndValidity();
    if (this.formulaireModificationPortefeuille.valid && this.formulaireModificationPortefeuille.value.champNom) {
      this.portefeuilleEnRenommage!.nom = this.formulaireModificationPortefeuille.value.champNom;
    }
    this.portefeuilleEnRenommage = undefined;
    this.setLocalStorage();
  }

  annulerRenommage() {
    this.portefeuilleEnRenommage = undefined;
  }

  configurerPortefeuille(portefeuille: Portefeuille) {
  }

  renommerPortefeuille(portefeuille: Portefeuille) {
    this.portefeuilleEnRenommage = portefeuille;
    this.formulaireModificationPortefeuille.get('champNom')?.setValue(portefeuille.nom);
  }

  supprimerPortefeuille(portefeuille: Portefeuille) {
    const idx = this.portefeuilles.findIndex(obj => obj.nom === portefeuille.nom);
    if (idx !== -1) {
      this.portefeuilles.splice(idx, 1);
    }
    this.setLocalStorage();
  }

  private setLocalStorage() {
    window.localStorage.setItem(GestionPortefeuillesComponent.PORTEFEUILLES, JSON.stringify(this.portefeuilles));
  }
}
