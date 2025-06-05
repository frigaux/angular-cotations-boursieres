import {Component, effect, input, InputSignal, output} from '@angular/core';
import {NgIf} from "@angular/common";
import {PickList} from "primeng/picklist";
import {DTOValeur} from '../../../../services/valeurs/dto-valeur.interface';
import {ValeursService} from '../../../../services/valeurs/valeurs.service';
import {ProgressBar} from 'primeng/progressbar';
import {TranslatePipe} from '@ngx-translate/core';
import {Portefeuille} from '../portefeuille.interface';
import {Panel} from 'primeng/panel';

@Component({
  selector: 'app-selecteur-valeurs',
  imports: [
    NgIf,
    PickList,
    ProgressBar,
    TranslatePipe,
    Panel
  ],
  templateUrl: './selecteur-valeurs.component.html',
  styleUrl: './selecteur-valeurs.component.sass'
})
export class SelecteurValeursComponent {
  // chargement des valeurs
  loading: boolean = true;

  // input/output
  portefeuille: InputSignal<Portefeuille | undefined> = input();
  ferme = output<void>();
  modifie = output<string[]>();

  // données pour la vue
  portefeuilleEnEdition: Portefeuille | undefined;
  valeursSource: DTOValeur[] = [];
  valeursTarget: DTOValeur[] = [];

  constructor(private valeursService: ValeursService) {
    effect(() => {
      this.initPicklist();
    });
  }

  initPicklist(): void {
    this.portefeuilleEnEdition = this.portefeuille();
    if (this.portefeuilleEnEdition) {
      this.valeursService.chargerValeurs().subscribe(valeurs => {
        this.valeursSource = valeurs.filter(valeur => !this.portefeuilleEnEdition!.tickers.includes(valeur.ticker));
        this.valeursTarget = valeurs.filter(valeur => this.portefeuilleEnEdition!.tickers.includes(valeur.ticker));
        this.loading = false;
      });
    }
  }

  enregistrer() {
    this.modifie.emit(this.valeursTarget.map(valeur => valeur.ticker));
  }
}
