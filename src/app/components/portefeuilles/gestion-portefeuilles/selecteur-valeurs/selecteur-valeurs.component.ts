import {Component, input, InputSignal, output} from '@angular/core';
import {NgIf} from "@angular/common";
import {PickList} from "primeng/picklist";
import {DTOValeur} from '../../../../services/valeurs/dto-valeur.interface';
import {ValeursService} from '../../../../services/valeurs/valeurs.service';
import {ProgressBar} from 'primeng/progressbar';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Portefeuille} from '../portefeuille.interface';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-selecteur-valeurs',
  imports: [
    NgIf,
    PickList,
    ProgressBar,
    TranslatePipe,
    Dialog,
    Button
  ],
  templateUrl: './selecteur-valeurs.component.html',
  styleUrl: './selecteur-valeurs.component.sass'
})
export class SelecteurValeursComponent {
  // chargement des valeurs
  loading: boolean = true;

  // input/output
  portefeuille: InputSignal<Portefeuille | undefined> = input(undefined,
    {transform: o => this.intercepteurPortefeuille(o)});
  modifie = output<string[]>();
  annule = output<void>();

  // données pour la vue
  portefeuilleEnModification: Portefeuille | undefined;
  titre: string | undefined;
  valeursSource: DTOValeur[] = [];
  valeursTarget: DTOValeur[] = [];

  constructor(private valeursService: ValeursService,
              private translateService: TranslateService) {
  }

  private intercepteurPortefeuille(portefeuille: Portefeuille | undefined) {
    this.portefeuilleEnModification = portefeuille;
    if (this.portefeuilleEnModification) {
      this.titre = this.translateService.instant('COMPOSANTS.PORTEFEUILLES.GESTION_PORTEFEUILLES.SELECTEUR_VALEURS.MODIFICATION_PORTEFEUILLE')
        + ' ' + this.portefeuilleEnModification.nom;
      this.initPicklist(this.portefeuilleEnModification);
    }
    return portefeuille;
  }

  initPicklist(portefeuille: Portefeuille): void {
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.valeursSource = valeurs.filter(valeur => !portefeuille!.tickers.includes(valeur.ticker));
      this.valeursTarget = valeurs.filter(valeur => portefeuille!.tickers.includes(valeur.ticker));
      this.loading = false;
    });
  }

  modifierValeursPortefeuille() {
    this.modifie.emit(this.valeursTarget.map(valeur => valeur.ticker));
  }
}
