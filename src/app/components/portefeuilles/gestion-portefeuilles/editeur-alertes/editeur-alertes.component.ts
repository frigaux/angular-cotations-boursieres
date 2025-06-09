import {Component, input, InputSignal, output} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {NgIf} from '@angular/common';
import {ProgressBar} from 'primeng/progressbar';
import {TranslateService} from '@ngx-translate/core';
import {Portefeuille} from '../portefeuille.interface';
import {Alerte} from '../alerte.interface';

@Component({
  selector: 'app-editeur-alertes',
  imports: [
    Dialog,
    NgIf,
    ProgressBar
  ],
  templateUrl: './editeur-alertes.component.html',
  styleUrl: './editeur-alertes.component.sass'
})
export class EditeurAlertesComponent {
  // chargement des valeurs
  loading: boolean = true;

  // input/output
  portefeuille: InputSignal<Portefeuille | undefined> = input(undefined,
    {transform: o => this.intercepteurPortefeuille(o)});
  modifie = output<Alerte[]>();
  annule = output<void>();

  // données pour la vue
  portefeuilleEnModification: Portefeuille | undefined;
  titre: string | undefined;

  constructor(private translateService: TranslateService) {
  }

  private intercepteurPortefeuille(portefeuille: Portefeuille | undefined) {
    this.portefeuilleEnModification = portefeuille;
    if (this.portefeuilleEnModification) {
      this.titre = this.translateService.instant('COMPOSANTS.PORTEFEUILLES.GESTION_PORTEFEUILLES.EDITEUR_ALERTES.MODIFICATION_PORTEFEUILLE', {'nom': this.portefeuilleEnModification.nom});
    }
    return portefeuille;
  }
}
